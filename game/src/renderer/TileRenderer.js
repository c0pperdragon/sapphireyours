
var TileRenderer = function() 
{   Renderer.call(this);
    this.program = 0;
    this.uMVPMatrix = 0;
    this.uScreenTileSize = 0;
    this.uTexture = 0;
    this.aCorner = 0;
    this.aTile = 0
    
    this.iboIndex = 0;       // buffer holding short
    this.vboCorner = 0;      // buffer holding byte[4][2] = {0,0},{1,0},{0,1},{1,1}  for each tile  
    this.vboTile = 0;        // buffer holding short[4] - x,y,tile,modifier  for each tile corner,  dublicated 4 times 
    this.txTexture = 0;      // texture buffer
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
    this.bufferTile = null;   // holding x,y,tile       
    this.matrix = null;       // projection matrix
    this.matrix2 = null;      // projection matrix for second player
    this.havematrix2 = false;        // is second matrix present?
    this.screentilesize = 0;         // size of tiles on screen in pixels    
    
    // data for the loading process
    this.imagesRequested = null;  // array of string
    this.imagesLoaded = null;     // Map: string -> array of tile indizes
    this.tilesLoaded = 0;
    this.tmpCanvas = null;
};    
TileRenderer.prototype = Object.create(Renderer.prototype);
    
    
TileRenderer.TILEWIDTH = 60;
TileRenderer.TILEHEIGHT = 60;
TileRenderer.ATLASWIDTH = 2048;
TileRenderer.ATLASHEIGHT = 2048; // 1024; 
TileRenderer.TILESPERROW = Math.floor(TileRenderer.ATLASWIDTH/(TileRenderer.TILEWIDTH+2));
TileRenderer.TILEROWS    = Math.floor(TileRenderer.ATLASHEIGHT/(TileRenderer.TILEHEIGHT+2));
TileRenderer.ATLASTILES = TileRenderer.TILESPERROW*TileRenderer.TILEROWS;

TileRenderer.MAXTILES = 64*64;
    
TileRenderer.vertexShaderCode =
            "uniform mat4 uMVPMatrix;                  "+
            "uniform int uScreenTileSize;              "+    // pixel size of tile on screen
            "attribute vec2 aCorner;                   "+    // one of 0,0  0,1  1,0,  1,1
            "attribute vec4 aTile;                     "+    // input as x,y,tile,modifiers
            "varying vec2 vTextureCoordinates;         "+    // output to fragment shader
            "float idiv(float a, float b) {            "+    //  to work around bugs in integer arithmetic
            "  return floor(a/b+0.00001);              "+    //  use only floats for calculations even if
            "}                                         "+    //  we really meant to do integer division
            "void main() {                             "+
            "  float ty = idiv(aTile[2],"+TileRenderer.TILESPERROW+".0);   "+     // y position (in tiles in atlas)
            "  float tx = aTile[2]-ty*"+TileRenderer.TILESPERROW+".0;      "+     // x position (in tiles in atlas)
            "  float rotate = idiv(aTile[3],60.0);            "+     // rotation modifier
            "  float shrink = aTile[3]-rotate*60.0;           "+     // shrink modifier
            "  vTextureCoordinates[0] = (tx*("+(TileRenderer.TILEWIDTH+2)+".0)+1.0+aCorner[0]*"+TileRenderer.TILEWIDTH+".0)/"+TileRenderer.ATLASWIDTH+".0;  "+
            "  vTextureCoordinates[1] = (ty*("+(TileRenderer.TILEWIDTH+2)+".0)+1.0+aCorner[1]*"+TileRenderer.TILEWIDTH+".0)/"+TileRenderer.ATLASHEIGHT+".0; "+
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
            "  p[0] = aTile[0] + (px+0.5)*float(uScreenTileSize); "+
            "  p[1] = aTile[1] + (py+0.5)*float(uScreenTileSize); "+
            "  p[2] = 0.0;                               "+
            "  p[3] = 1.0;                               "+
            "  gl_Position = uMVPMatrix * p;             "+
            "} ";
    
TileRenderer.fragmentShaderCode =
            "varying mediump vec2 vTextureCoordinates;        "+  // input from vertex shader
            "uniform sampler2D uTexture;                      "+  // uniform specifying the texture 
            "void main() {                                    "+
            "   gl_FragColor = texture2D(uTexture,vTextureCoordinates);  "+  
//            "   gl_FragColor = vec4(0.7, 0.2, 0.8, 0.5);" +
            "}                                                "+
            "";
    
    
// set up opengl  and load textures
TileRenderer.prototype.$ = function(gl,imagelist)
{
    Renderer.prototype.$.call(this,gl);
        
    // allocate memory for projection matrix
    this.matrix = new Array(16);
    this.matrix2 = new Array(16);
                
    // create shaders and link together
    this.program = this.createProgram(TileRenderer.vertexShaderCode,TileRenderer.fragmentShaderCode);        
    // extract the bindings for the uniforms and attributes
    this.uMVPMatrix = gl.getUniformLocation(this.program, "uMVPMatrix");
    this.uScreenTileSize = gl.getUniformLocation(this.program, "uScreenTileSize");
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
    this.bufferTile = []; // ShortBuffer.allocate(MAXTILES*4);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTile);
    gl.bufferData(gl.ARRAY_BUFFER, 2*(TileRenderer.MAXTILES*4*4), gl.DYNAMIC_DRAW);
        
    // create the buffer for the texture atlas
    this.txTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.txTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TileRenderer.ATLASWIDTH,TileRenderer.ATLASHEIGHT, 
        0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // NEAREST);             
    
    // loading progress information
    this.imagesRequested = imagelist;
    this.imagesLoaded = new Map();
    this.tilesLoaded = 0;
    this.tmpCanvas = document.createElement('canvas');
    this.tmpCanvas.width = TileRenderer.TILEWIDTH;
    this.tmpCanvas.height = TileRenderer.TILEHEIGHT;
    for (var i=0; i<imagelist.length; i++)
    {   this.startLoadImage(imagelist[i]);
    }
    
    return this;
};

TileRenderer.prototype.startLoadImage = function(filename)
{
    var image = new Image();
    
    var that = this;
    image.addEventListener
    (   'load', function() 
        {   var gl = that.gl;
        
            var w = image.naturalWidth;
            var h = image.naturalHeight;
            var rows = Math.floor(h/TileRenderer.TILEHEIGHT);
            var cols = Math.floor(w/TileRenderer.TILEWIDTH);
            
            var tiles = [];
            
            gl.bindTexture(gl.TEXTURE_2D, that.txTexture);
            var cc = that.tmpCanvas.getContext("2d");
            for (var x=0; x<cols; x++) 
            {   for (var y=0; y<rows; y++) 
                {   
                    var tn = that.tilesLoaded++;
                    tiles.push(tn);
                    
                    cc.clearRect(0,0, TileRenderer.TILEWIDTH, TileRenderer.TILEHEIGHT);
                    cc.drawImage(image, TileRenderer.TILEWIDTH*x, TileRenderer.TILEHEIGHT*y, 
                                        TileRenderer.TILEWIDTH, TileRenderer.TILEHEIGHT, 
                                        0,0,
                                        TileRenderer.TILEWIDTH, TileRenderer.TILEHEIGHT);                    
                    gl.texSubImage2D
                    (   gl.TEXTURE_2D, 
                        0, 
                        (tn % (TileRenderer.TILESPERROW)) * (TileRenderer.TILEWIDTH+2),
                        Math.floor(tn / (TileRenderer.TILESPERROW)) * (TileRenderer.TILEHEIGHT+2), 
                        gl.RGBA, 
                        gl.UNSIGNED_BYTE,
                        that.tmpCanvas 
                    );
                }
            }
            
            if (tiles.length<1) tiles=[0];  // have 0-tile as default (may clash with real 0-tile)
            that.imagesLoaded.set(filename, tiles);   
            
            if (that.imagesLoaded.size==that.imagesRequested.length)
            {   console.log("Loaded "+that.imagesRequested.length
                +" images into "+that.tilesLoaded+" tiles");
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
    return this.imagesLoaded.size >= this.imagesRequested.length;
};
    
TileRenderer.prototype.getImage = function(filename)
{
    var tiles = this.imagesLoaded.get(filename);
    if (!tiles) 
    {   console.log("Referenced non-loaded image:",filename);
        return [];
    }
    return tiles;
};    
    
TileRenderer.prototype.startDrawing = function(viewportwidth,viewportheight, screentilesize, offx0, offy0, offx1, offy1)
{
    this.screentilesize = screentilesize;        
    this.bufferTile.length = 0;
    
    // when having same offsets, only one draw is necessary      
    if (offx0==offx1 && offy0==offy1)
    {   Matrix.setIdentityM(this.matrix,0);     
        Matrix.translateM(this.matrix,0, -1.0,1.0, 0);     
        Matrix.scaleM(this.matrix,0, 2.0/viewportwidth, -2.0/viewportheight, 1.0);            
        Matrix.translateM(this.matrix,0, offx0, offy0, 0);
        this.havematrix2 = false;
    }
    // must draw 2 screens with a terminator line so there is a piece of each players area visible
    else                        
    {   
//          // adjust offsets so both views are moved closer together
//          if (offx0>offx+splitthreasholdx)        offx0 -= splitthreasholdx;
//          else if (offx0<offx-splitthreasholdx)   offx0 += splitthreasholdx;
//          else offx0 = offx;
//          if (offy0>offy+splitthreasholdy)        offy0 -= splitthreasholdy;
//          else if (offy0<offy-splitthreasholdy)   offy0 += splitthreasholdy;
//          else offy0 = offy;
//          if (offx1>offx+splitthreasholdx)        offx1 -= splitthreasholdx;
//          else if (offx1<offx-splitthreasholdx)   offx1 += splitthreasholdx;
//          else offx1 = offx;
//          if (offy1>offy+splitthreasholdy)        offy1 -= splitthreasholdy;
//          else if (offy1<offy-splitthreasholdy)   offy1 += splitthreasholdy;
//          else offy1 = offy;
            
            // calculate the normal vector (2d) of the delimiter line  (clockwise, 0=right)
//          float screenratio = (viewportwidth*1.0f) / viewportheight;
            var screendiagonal = Math.sqrt(viewportwidth*viewportwidth+viewportheight*viewportheight);
            var angle = Math.atan2(offx0-offx1, offy0-offy1); 

            // start with normal matrix for first player
            Matrix.setIdentityM(this.matrix,0);
            // make the matrix tilt to let half of the screen be nearer than 0.0 (which will become invisible because of the near-plane clipping)
            this.matrix[2] = -Math.cos(angle)/(screendiagonal/viewportwidth); 
            this.matrix[6] = -Math.sin(angle)/(screendiagonal/viewportheight);
                
            // transform to a coordinate system with the units as pixels, with 0,0 at top left corner and the z=0 goes to the near plane
            Matrix.translateM(this.matrix,0, -1.0,1.0, -1.0 - (2.0/screendiagonal));     
            Matrix.scaleM(this.matrix,0, 2.0/viewportwidth, -2.0/viewportheight, 1.0);
            
            // move to desired view position 
            Matrix.translateM(this.matrix,0,offx0,offy0, 0.0);                      

            // start with normal matrix for second player
            Matrix.setIdentityM(this.matrix2,0);
            // make the matrix tilt to let half of the screen be nearer than 0.0 (which will become invisible because of the near-plane clipping)
            this.matrix2[2] = Math.cos(angle)/(screendiagonal/viewportwidth); 
            this.matrix2[6] = Math.sin(angle)/(screendiagonal/viewportheight); 
                
            // transform to a coordinate system with the units as pixels, with 0,0 at top left corner and the z=0 goes to the near plane
            Matrix.translateM(this.matrix2,0, -1.0,1.0, -1.0 - (2.0/screendiagonal));        
            Matrix.scaleM(this.matrix2,0, 2.0/viewportwidth, -2.0/viewportheight, -1.0);
            
            // move to desired view position 
            Matrix.translateM(this.matrix2,0,offx1,offy1, 0.0);

            this. havematrix2 = true;
        }
};
    
TileRenderer.prototype.addTile = function(x, y, tile)
{        
    this.bufferTile.push(x,y,(tile&0x7fff),(tile>>16)&0x7fff);  
};

TileRenderer.prototype.flush = function()   
{
        var gl = this.gl;
//profiler_draw.done(10);   
        // check how many tiles are currently visible  
        var activetiles = this.bufferTile.length / 4;
        if (activetiles==0)
        {   return;
        }
        
        // transfer tile info buffer into opengl (consists of 4 identical parts) 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTile);
        for (var i=0; i<4; i++)     
        {   this.copyToBufferAsUint16(gl.ARRAY_BUFFER, i*2*4*TileRenderer.MAXTILES, this.bufferTile);
        }
        this.bufferTile.length = 0;
        
        // set up gl for painting all quads
        gl.useProgram(this.program);
        
        // set texture unit 0 to use the texture and tell shader to use texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.txTexture);
        gl.uniform1i(this.uTexture, 0);
        gl.uniform1i(this.uScreenTileSize, this.screentilesize);
        
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
        gl.drawElements(gl.TRIANGLES, activetiles*6, gl.UNSIGNED_SHORT, 0);

        // optionally draw the scene for the second player also
        if (this.havematrix2)
        {   gl.uniformMatrix4fv(this.uMVPMatrix, false, this.matrix2);        
            gl.drawElements(gl.TRIANGLES, activetiles*6, gl.UNSIGNED_SHORT, 0);
        }
            
        // Disable vertex arrays
        gl.disableVertexAttribArray(this.aCorner);
        gl.disableVertexAttribArray(this.aTile);
};
    
