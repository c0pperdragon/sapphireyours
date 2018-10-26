"use strict";
var TileRenderer = function() 
{   Renderer.call(this);
    this.program = 0;
    this.uMVPMatrix = 0;
    this.uTexture = 0;
    this.aCorner = 0;
    this.aTile = 0
    
    this.iboIndex = 0;       // buffer holding short
    this.vboCorner = 0;      // buffer holding byte[4][2] = {0,0},{1,0},{0,1},{1,1}  for each tile  
    this.vboTile = 0;        // buffer holding short[4] - x,y,tile,modifier  for each tile corner, 4 times each
    this.txTexture = 0;      // texture buffer
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
    this.numTiles = 0;
    this.bufferTile = null;   // holding x,y,tile,modifier 
    this.matrix = null;       // projection matrix
    this.matrix2 = null;      // projection matrix for second player
    this.havematrix2 = false;        // is second matrix present?
    
    // data for the loading process
    this.imageList = null;        // Map: string -> array of tile indizes (array is created empty before first load)
    this.imagesRequested = null;  // Map: string -> true: all images that have been requested but are not loaded yet
    this.tilesAssigned = 0;       // number of tiles that have been assigned a spot in the texture atlas
    
    this.loadedTileSize = 0;
    this.tmpCanvas = null;
};    
TileRenderer.prototype = Object.create(Renderer.prototype);
    
    
TileRenderer.MAXTILES = 64*64;

TileRenderer.ATLASROWS = 36;
TileRenderer.ATLASCOLUMNS = 36;

    
TileRenderer.vertexShaderCode =
            "uniform mat4 uMVPMatrix;                  "+
            "attribute vec2 aCorner;                   "+    // one of 0,0  0,1  1,0,  1,1
            "attribute vec4 aTile;                     "+    // input as x,y,tile,modifiers
            "varying vec2 vTextureCoordinates;         "+    // output to fragment shader
            "float idiv(float a, float b) {            "+    //  to work around bugs in integer arithmetic
            "  return floor(a/b+0.00001);              "+    //  use only floats for calculations even if
            "}                                         "+    //  we really meant to do integer division
            "void main() {                             "+
            "  float ty = idiv(aTile[2],"+TileRenderer.ATLASCOLUMNS+".0); "+     // y position (in tiles in atlas)
            "  float tx = aTile[2]-ty*"+TileRenderer.ATLASCOLUMNS+".0;    "+     // x position (in tiles in atlas)
            "  float rotate = idiv(aTile[3],60.0);        "+     // rotation modifier
            "  float shrink = aTile[3]-rotate*60.0;       "+     // shrink modifier
            "  vTextureCoordinates[0] = (tx+aCorner[0]*0.9375)/"+TileRenderer.ATLASCOLUMNS+".0;  "+
            "  vTextureCoordinates[1] = (ty+aCorner[1]*0.9375)/"+TileRenderer.ATLASROWS+".0; "+
            "  float px = aCorner[0]-0.5;                 "+    // bring center of tile to 0/0 
            "  float py = aCorner[1]-0.5;                 "+
            "  px = px*(1.0-shrink/60.0);                 "+    // apply shrink value
            "  py = py*(1.0-shrink/60.0);                 "+
            "  float si = sin(rotate*0.017453292519943);  "+   // degrees -> rad 
            "  float co = cos(rotate*0.017453292519943);  "+
            "  float px2 = px*co + py*si;                 "+    // rotation value
            "  py = (-px*si) + py*co;                     "+
            "  px = px2;                                  "+
            "  vec4 p;                                    "+
            "  p[0] = aTile[0]+(px+0.5)*60.0; "+
            "  p[1] = aTile[1]+(py+0.5)*60.0; "+
            "  p[2] = 0.0;                               "+
            "  p[3] = 1.0;                               "+
            "  gl_Position = uMVPMatrix * p;             "+
            "} ";   
TileRenderer.fragmentShaderCode =
            "varying mediump vec2 vTextureCoordinates;        "+  // input from vertex shader
            "uniform sampler2D uTexture;                      "+  // uniform specifying the texture 
            "void main() {                                    "+
            "   gl_FragColor = texture2D(uTexture,vTextureCoordinates);  "+  
            "}                                                "+
            "";
    
    
// set up opengl  and load textures
TileRenderer.prototype.$ = function(game,imagelist)
{
    Renderer.prototype.$.call(this,game);
    var gl = game.gl;
    
    // allocate memory for projection matrix
    this.matrix = new Array(16);
    this.matrix2 = new Array(16);
                
    // create shaders and link together
    this.program = this.createProgram(TileRenderer.vertexShaderCode,TileRenderer.fragmentShaderCode);        
    // extract the bindings for the uniforms and attributes
    this.uMVPMatrix = gl.getUniformLocation(this.program, "uMVPMatrix");
    this.uTexture = gl.getUniformLocation(this.program, "uTexture");
    this.aCorner = gl.getAttribLocation(this.program, "aCorner");
    this.aTile = gl.getAttribLocation(this.program, "aTile");

    // index buffer (to paint quads, picking the vertices from the correct position)
    this.iboIndex = gl.createBuffer();
    var sb = new Uint16Array(6*TileRenderer.MAXTILES);
    for (var i=0; i<TileRenderer.MAXTILES; i++)
    {   sb[i*6+0] = 0*TileRenderer.MAXTILES+i; 
        sb[i*6+1] = 1*TileRenderer.MAXTILES+i;
        sb[i*6+2] = 2*TileRenderer.MAXTILES+i; 
        sb[i*6+3] = 1*TileRenderer.MAXTILES+i;
        sb[i*6+4] = 3*TileRenderer.MAXTILES+i; 
        sb[i*6+5] = 2*TileRenderer.MAXTILES+i; 
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboIndex);    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sb, gl.STATIC_DRAW);
    sb = null;
    
    // buffer for the tile corner identifiers 
    this.vboCorner = gl.createBuffer();
    var bb = new Uint8Array(TileRenderer.MAXTILES*4*2);
    for (var i=0; i<TileRenderer.MAXTILES; i++)
    {   bb[2*i+0] = 0; 
        bb[2*i+1] = 0; 
    }
    for (var i=TileRenderer.MAXTILES; i<2*TileRenderer.MAXTILES; i++)
    {   bb[2*i+0] = 1;
        bb[2*i+1] = 0; 
    }
    for (var i=2*TileRenderer.MAXTILES; i<3*TileRenderer.MAXTILES; i++)
    {   bb[2*i+0] = 0;
        bb[2*i+1] = 1; 
    }
    for (var i=3*TileRenderer.MAXTILES; i<4*TileRenderer.MAXTILES; i++)
    {   bb[2*i+0] = 1;
        bb[2*i+1] = 1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
    gl.bufferData(gl.ARRAY_BUFFER, bb, gl.STATIC_DRAW);    
    bb = null;

    // buffer for tiles info can not be pre-computed, but client-side and gl buffers are allocated
    this.vboTile = gl.createBuffer();
    this.numTiles = 0;
    this.bufferTile = new Uint16Array(TileRenderer.MAXTILES*4);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTile);
    gl.bufferData(gl.ARRAY_BUFFER, 2*(TileRenderer.MAXTILES*4*4), gl.DYNAMIC_DRAW);
        
    // trigger loading textures
    this.imageList = new Map();
    for (var i=0; i<imagelist.length; i++)
    {   this.imageList.set(imagelist[i], new Array(0));
    }    
    this.imagesRequested = new Map();
    this.numTilesAssigned = 0;
    this.loadOrReloadAllImages();
    
    return this;
};

// handle the loading (or reloading after zoom level change) of tile textures
TileRenderer.prototype.loadOrReloadAllImages = function()
{
    // only check if reload is necessary
    if (this.loadedTileSize==this.game.pixeltilesize) { return; }
    
    var gl = this.game.gl;
    
    // if there is already an old texture atlas present, remove it
    if (this.txTexture)
    {   gl.deleteTexture(this.txTexture)
        this.txTexture = 0;
    }
    
    // memorize which size the loaded tiles are kept at
    this.loadedTileSize = this.game.pixeltilesize;
    var sizewithmargin = Math.round(this.loadedTileSize / 0.9375);  // (60->64) 

    // create the buffer for the texture atlas
    this.txTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.txTexture);
    gl.texImage2D
    (   gl.TEXTURE_2D, 0, gl.RGBA, 
        sizewithmargin*TileRenderer.ATLASCOLUMNS,
        sizewithmargin*TileRenderer.ATLASROWS,
        0, gl.RGBA, gl.UNSIGNED_BYTE, null
    );

//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // LINEAR);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // LINEAR); // NEAREST);             
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // prepare temporary canvas for scaling
    this.tmpCanvas = document.createElement('canvas');
    this.tmpCanvas.width = this.loadedTileSize;
    this.tmpCanvas.height = this.loadedTileSize;
    
    // trigger loading of all images that are not currently in process of being loaded already
    this.imageList.forEach
    (   function(value,key,map)
        {   if (!this.imagesRequested.has(key))
            {   this.startLoadImage(key);
            }
        },
        this
    );
}

TileRenderer.prototype.startLoadImage = function(filename)
{
    this.imagesRequested.set(filename,true);
    var image = new Image();
    
    var that = this;
    image.addEventListener
    (   'load', function() 
        {   var gl = that.game.gl;
        
            var h = image.naturalHeight;
            var w = h;
            var cols = Math.max(1,Math.floor(image.naturalWidth/w));
            
            var tiles = that.imageList.get(filename);
            if (tiles.length<1)
            {   for (var i=0; i<cols; i++) 
                {   tiles.push(that.numTilesAssigned++);
                }
            }
            gl.bindTexture(gl.TEXTURE_2D, that.txTexture);
            var cc = that.tmpCanvas.getContext("2d");

            for (var i=0; i<cols; i++) 
            {   var sizewithmargin = Math.round(that.loadedTileSize / 0.9375);  // (60->64) 

                cc.clearRect(0,0, that.loadedTileSize, that.loadedTileSize);
                cc.drawImage
                (   image, w*i, 0, w, h, 
                    0,0, that.loadedTileSize, that.loadedTileSize
                );
//                cc.fillStyle = "orange";
//                cc.fillRect(10,10,40,40);
                
                gl.texSubImage2D
                (   gl.TEXTURE_2D, 
                    0, 
                    (tiles[i] % TileRenderer.ATLASCOLUMNS) * sizewithmargin,
                    Math.floor(tiles[i] / TileRenderer.ATLASCOLUMNS) * sizewithmargin, 
                    gl.RGBA, 
                    gl.UNSIGNED_BYTE,
                    that.tmpCanvas 
                );
            }                        
            
            that.imagesRequested.delete(filename);
            
            if (that.imagesRequested.size==0)
            {   console.log
                (   "Loaded "+that.imageList.size+" images"
                    +" into "+that.numTilesAssigned+" of " 
                    +TileRenderer.ATLASCOLUMNS * TileRenderer.ATLASROWS+" tiles"
                    +" ("+that.loadedTileSize+"x"+that.loadedTileSize+")"
                );
                that.game.setDirty();
            }
        }
    );
    image.addEventListener
    (   'error', function()
        {   console.log("Error loading image "+fullname);
        }
    );
    
    var fullname = "art/" + filename + ".png";
    image.src = fullname;
//   console.log("started loading",fullname);
};

TileRenderer.prototype.isLoaded = function()
{
    return this.imagesRequested.size == 0;
};
    
TileRenderer.prototype.getImage = function(filename)
{
    var tiles = this.imageList.get(filename);
    if ((!tiles) || tiles.length<1) 
    {   console.log("Referenced non-loaded image:",filename);
        return [];
    }
    return tiles;
};    
    
TileRenderer.prototype.startDrawing = function(offx0, offy0, offx1, offy1)
{  
    // initialize the drawing buffers
    this.numTiles = 0;
    var viewportwidth = this.game.pixelwidth;
    var viewportheight = this.game.pixelheight;
    var tilezoom = this.loadedTileSize / 60.0;
    
    // snap offsets to true pixels
    offx0 = Math.round(offx0*tilezoom) / tilezoom;
    offy0 = Math.round(offy0*tilezoom) / tilezoom;
    offx1 = Math.round(offx1*tilezoom) / tilezoom;
    offy1 = Math.round(offy1*tilezoom) / tilezoom;
    
    // when having same offsets, only one draw is necessary      
    if (offx0==offx1 && offy0==offy1)
    {   Matrix.setIdentityM(this.matrix,0);     
        Matrix.translateM(this.matrix,0, -1.0,1.0, 0);     
        Matrix.scaleM(this.matrix,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, 1.0);            
        Matrix.translateM(this.matrix,0, offx0, offy0, 0);
        this.havematrix2 = false;
    }
    // must draw 2 screens with a terminator line so there is a piece of each players area visible
    else                        
    {       // calculate the normal vector (2d) of the delimiter line  (clockwise, 0=right)
            var screendiagonal = Math.sqrt(viewportwidth*viewportwidth+viewportheight*viewportheight);
            var angle = Math.atan2(offy1-offy0,offx0-offx1); 

            // start with normal matrix for first player
            Matrix.setIdentityM(this.matrix,0);
            // make the matrix tilt to let half of the screen be nearer than 0.0 (which will become invisible because of the near-plane clipping)
            this.matrix[2] = -Math.cos(angle)/(screendiagonal/viewportwidth); 
            this.matrix[6] = -Math.sin(angle)/(screendiagonal/viewportheight);
                
            // transform to a coordinate system with the units as pixels, with 0,0 at top left corner and the z=0 goes to the near plane
            Matrix.translateM(this.matrix,0, -1.0,1.0, -1.0 - (2.0/screendiagonal));     
            Matrix.scaleM(this.matrix,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, 1.0);
            
            // move to desired view position 
            Matrix.translateM(this.matrix,0,offx0,offy0, 0.0);                      

            // start with normal matrix for second player
            Matrix.setIdentityM(this.matrix2,0);
            // make the matrix tilt to let half of the screen be nearer than 0.0 (which will become invisible because of the near-plane clipping)
            this.matrix2[2] = Math.cos(angle)/(screendiagonal/viewportwidth); 
            this.matrix2[6] = Math.sin(angle)/(screendiagonal/viewportheight); 
                
            // transform to a coordinate system with the units as pixels, with 0,0 at top left corner and the z=0 goes to the near plane
            Matrix.translateM(this.matrix2,0, -1.0,1.0, -1.0 - (2.0/screendiagonal));        
            Matrix.scaleM(this.matrix2,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, -1.0);
            
            // move to desired view position 
            Matrix.translateM(this.matrix2,0,offx1,offy1, 0.0);

            this.havematrix2 = true;
        }
};
    
TileRenderer.prototype.addTile = function(x, y, tile)
{        
    var b = this.bufferTile;
    var target = 4*this.numTiles;
    b[target+0] = x;
    b[target+1] = y;
    b[target+2] = (tile&0x7fff);
    b[target+3] = (tile>>16)&0x7fff;
    this.numTiles++;
};

TileRenderer.prototype.startDrawingMini = function(leftborder,columns,rows)
{  
    // initialize the drawing buffers
    this.numTiles = 0;
    var viewportwidth = this.game.pixelwidth;
    var viewportheight = this.game.pixelheight;
    var pixelleft = (leftborder * this.game.pixelwidth)/this.game.screenwidth;
    var tilesize = this.loadedTileSize; 
    var tilezoom = tilesize / 120;     // use half size for decoration
    
    var offx0 = (viewportwidth/2+pixelleft/2)/tilezoom - columns*60/2;
    var offy0 = viewportheight/2/tilezoom - rows*60/2;
    var offx0 = Math.round(offx0*tilezoom) / tilezoom;
    var offy0 = Math.round(offy0*tilezoom) / tilezoom;
    
    Matrix.setIdentityM(this.matrix,0);
    Matrix.translateM(this.matrix,0, -1.0, 1.0, 0);
    Matrix.scaleM(this.matrix,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, 1.0); 
    Matrix.translateM(this.matrix,0, offx0, offy0, 0);
    this.havematrix2 = false;
};

TileRenderer.prototype.startDrawDecoration = function()
{  
    // initialize the drawing buffers
    this.numTiles = 0;
    var viewportwidth = this.game.pixelwidth;
    var viewportheight = this.game.pixelheight;
    var tilezoom = this.loadedTileSize / 120;   // use half size for decoration

    Matrix.setIdentityM(this.matrix,0);
    Matrix.translateM(this.matrix,0, -1.0,1.0, 0);
    Matrix.scaleM(this.matrix,0, 2.0*tilezoom/viewportwidth, -2.0*tilezoom/viewportheight, 1.0);
    this.havematrix2 = false;
};    
    
TileRenderer.prototype.addDecorationTile = function(pixelx, pixely, tile)
{       
    var zoomfactor = (this.game.pixelwidth / this.game.screenwidth) * 120 / this.loadedTileSize;
    var b = this.bufferTile;
    var target = 4*this.numTiles;
    b[target+0] = Math.round(pixelx*zoomfactor) - 30;
    b[target+1] = Math.round(pixely*zoomfactor) - 30;
    b[target+2] = (tile&0x7fff);
    b[target+3] = (tile>>16)&0x7fff;
    this.numTiles++;
};

TileRenderer.prototype.flush = function()   
{
    // fast termination if nothing to draw
    if (this.numTiles<1) { return; }

        var g = this.game;
        var gl = g.gl;
        
        // transfer tile info buffer into opengl (consists of 4 identical parts) 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTile);
        var subarr = this.bufferTile.subarray(0,4*this.numTiles);
        for (var i=0; i<4; i++)     
        {   gl.bufferSubData(gl.ARRAY_BUFFER, i*2*4*TileRenderer.MAXTILES, subarr );
        }
        
        // set up gl for painting all quads
        gl.useProgram(this.program);
        
        // set texture unit 0 to use the texture and tell shader to use texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.txTexture);
        gl.uniform1i(this.uTexture, 0);
        
        // enable all vertex attribute arrays and set pointers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
        gl.enableVertexAttribArray(this.aCorner);
        gl.vertexAttribPointer(this.aCorner, 2, gl.UNSIGNED_BYTE, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTile);
        gl.enableVertexAttribArray(this.aTile);
        gl.vertexAttribPointer(this.aTile, 4, gl.SHORT, false, 0, 0);
               
        // set index array
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboIndex);
        
        // draw the scene for one player
        gl.uniformMatrix4fv(this.uMVPMatrix, false, this.matrix);        
        gl.drawElements(gl.TRIANGLES, this.numTiles*6, gl.UNSIGNED_SHORT, 0);

        // optionally draw the scene for the second player also
        if (this.havematrix2)
        {   gl.uniformMatrix4fv(this.uMVPMatrix, false, this.matrix2);        
            gl.drawElements(gl.TRIANGLES, this.numTiles*6, gl.UNSIGNED_SHORT, 0);
        }
            
        // Disable vertex arrays
        gl.disableVertexAttribArray(this.aCorner);
        gl.disableVertexAttribArray(this.aTile);
        
        this.numTiles = 0;
};
    
