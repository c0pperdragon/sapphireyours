"use strict";
// object allocator function
var TextRenderer = function()  
{   Renderer.call(this);
    this.program = 0;
    this.uMVPMatrix = 0;
    this.uTexture = 0;
    this.uTextureSize = 0;
    this.aCorner = 0;
    this.aColor = 0;
    this.aTextureCoordinates = 0;
    this.aDistanceThreshold = 0;
        
    this.iboIndex = 0;              // buffer holding short
    this.vboCorner = 0;             // buffer holding float[2] - destination coordinates (in pixel)
    this.vboColor = 0;              // buffer holding byte[4] - color 
    this.vboTextureCoordinates = 0; // buffer holding short[2] - font texture coordinates (in pixel)    
    this.vboDistanceThreshold = 0;  // buffer holding float  - distance field threshold value
    this.txFont = 0;                // texture buffer for the distance field representation of the font
    
    // client-side buffers to prepare the data before moving it into their gl counterparts
    this.numGlyphs = 0;
    this.bufferCorner = null;
    this.bufferColor = null;
    this.bufferTextureCoordinates = null;
    this.bufferDistanceThreshold = null;
            
    this.matrix = null;       // projection matrix

    this.glyph_coordinates = null;
    this.kerning = 0;   
    
    // data that needs loading
    this.textureSize = null;    
};
TextRenderer.prototype = Object.create(Renderer.prototype);


TextRenderer.WEIGHT_THIN = 135;
TextRenderer.WEIGHT_PLAIN = 120;
TextRenderer.WEIGHT_BOLD = 100;
    
TextRenderer.vertexShaderCode =
            "uniform mat4 uMVPMatrix;      "+
            "uniform vec2 uTextureSize;    "+   // width/height of texture in pixels
            "attribute vec2 aCorner;       "+   // location on screen (before transformation)
            "attribute vec4 aColor;               "+   // color to apply to font  
            "attribute vec2 aTextureCoordinates;  "+   // coordinate in texture (in pixels)   
            "attribute float aDistanceThreshold;  "+   // threshold for inside outside decision
            "varying vec2 vTextureCoordinates;    "+      // coordinate in texture (in 0.0 - 1.0) to be passed to fragment shader
            "varying vec4 vColor;                 "+                   // color to be passed to fragment shader
            "varying float vDistanceThreshold;    "+ // distance threshold to be passed to fragment shader
            "void main() {                        "+
            "  vec4 p;                            "+
            "  p[0] = aCorner[0];                 "+
            "  p[1] = aCorner[1];                 "+
            "  p[2] = 0.0;                        "+
            "  p[3] = 1.0;                        "+
            "  gl_Position = uMVPMatrix * p;      "+
            "  vTextureCoordinates[0] = aTextureCoordinates[0]/uTextureSize[0]; "+
            "  vTextureCoordinates[1] = aTextureCoordinates[1]/uTextureSize[1]; "+
            "  vDistanceThreshold = aDistanceThreshold/255.0;                   "+
            "  vColor = aColor / 255.0;                                         "+
            "}                                         "+
            "";    
TextRenderer.fragmentShaderCode =
            "uniform sampler2D uTexture;                      "+  // uniform specifying the texture 
            "varying mediump vec2 vTextureCoordinates;        "+  // input from vertex shader
            "varying mediump vec4 vColor;                     "+  // input from vertex shader
            "varying mediump float vDistanceThreshold;        "+  // input from vertex shader
            "void main() {                                    "+
            "   mediump float distance = texture2D(uTexture,vTextureCoordinates)[3];  "+ 
            "   gl_FragColor = vColor;                                                "+
            "   gl_FragColor[3] = vColor[3] * smoothstep(vDistanceThreshold-0.08,vDistanceThreshold+0.08,distance); "+
            "}                                                                        "+
            "";
    
TextRenderer.MAXGLYPHS = 5000;  // number of glyphs that can be rendered in one call


TextRenderer.prototype.$ = function(gl)
{
    Renderer.prototype.$.call(this,gl);

        // create shaders and link together
        this.program = this.createProgram(TextRenderer.vertexShaderCode,TextRenderer.fragmentShaderCode);
        // extract the bindings for the uniforms and attributes
        this.uMVPMatrix = gl.getUniformLocation(this.program, "uMVPMatrix");
        this.uTexture = gl.getUniformLocation(this.program, "uTexture");
        this.uTextureSize = gl.getUniformLocation(this.program, "uTextureSize");
        this.aCorner = gl.getAttribLocation(this.program, "aCorner");
        this.aColor = gl.getAttribLocation(this.program, "aColor");
        this.aTextureCoordinates = gl.getAttribLocation(this.program, "aTextureCoordinates");
        this.aDistanceThreshold = gl.getAttribLocation(this.program, "aDistanceThreshold");
        
        // create index buffer
        var sb = new Uint16Array(6*TextRenderer.MAXGLYPHS);
        for (var i=0; i<TextRenderer.MAXGLYPHS; i++)
        {   sb[6*i+0] = 4*i+0; 
            sb[6*i+1] = 4*i+1; 
            sb[6*i+2] = 4*i+2; 
            sb[6*i+3] = 4*i+1; 
            sb[6*i+4] = 4*i+3; 
            sb[6*i+5] = 4*i+2; 
        }
        this.iboIndex = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboIndex);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, sb, gl.STATIC_DRAW);
        sb = null;
        
        // create buffers (gl and client) that hold 4 entries for every glyph
        this.bufferCorner = new Float32Array(2*4*TextRenderer.MAXGLYPHS);
        this.vboCorner = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
        gl.bufferData(gl.ARRAY_BUFFER, 2*4*4*TextRenderer.MAXGLYPHS, gl.DYNAMIC_DRAW);

        this.bufferColor = new Uint8Array(4*4*TextRenderer.MAXGLYPHS);
        this.vboColor = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
        gl.bufferData(gl.ARRAY_BUFFER, 4*4*TextRenderer.MAXGLYPHS, gl.DYNAMIC_DRAW);

        this.bufferTextureCoordinates = new Uint16Array(2*4*TextRenderer.MAXGLYPHS);
        this.vboTextureCoordinates = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTextureCoordinates);
        gl.bufferData(gl.ARRAY_BUFFER, 2*4*2*TextRenderer.MAXGLYPHS, gl.DYNAMIC_DRAW);

        this.bufferDistanceThreshold = new Float32Array(4*TextRenderer.MAXGLYPHS);
        this.vboDistanceThreshold = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboDistanceThreshold);
        gl.bufferData(gl.ARRAY_BUFFER, 4*4*TextRenderer.MAXGLYPHS, gl.DYNAMIC_DRAW);

        this.matrix = new Array(16);
                                
        var that = this;    
        // load and decode the font glyph description 
        Game.getJSON
        (   "gfx/fontdesc.json", 
            function(json)
            {   that.glyph_coordinates = new Array(256);
                for (var i=0; i<json.glyphs.length; i++) 
                {   var g = json.glyphs[i];            
                    var code = g.code;
                    if (code>=0 && code<that.glyph_coordinates.length)
                    {   that.glyph_coordinates[code] = [ g.x, g.y, g.width, g.height ];
                    }
                    that.kerning = json.kerning;
                }
            }
        );
        
        // load the font bitmap
        this.txFont = gl.createTexture();        
        this.loadImageToTexture
        (   "gfx/font.png", 
            this.txFont, 
            true, 
            function(metrics) 
            {   that.textureSize = metrics;
            }
        );
        
        return this;
};

TextRenderer.prototype.isLoaded = function()
{
    return this.textureSize!==null && this.glyph_coordinates!==null;
};

TextRenderer.prototype.startDrawing = function(viewportwidth, viewportheight)
{
    this.numGlyphs = 0;
        
    // transfer coordinate system from the opengl-standard to a pixel system (0,0 is top left)
    Matrix.setIdentityM(this.matrix,0);     
    Matrix.translateM(this.matrix,0, -1.0,1.0, 0);     
    Matrix.scaleM(this.matrix,0, 2.0/viewportwidth, -2.0/viewportheight, 1.0);
};

TextRenderer.prototype.addGlyph = function(code, x, y, height, rightaligned, argb, weight)
{
    var coordinates = code<this.glyph_coordinates.length ? this.glyph_coordinates[code] : null;
    if (coordinates==null)
    {   coordinates = this.glyph_coordinates[32];  // unknown letter default to space
    }
        
    var tx1 = coordinates[0];
    var ty1 = coordinates[1];
    var twidth = coordinates[2]; 
    var theight = coordinates[3];
    var tx2 = tx1+twidth;
    var ty2 = ty1+theight;
            
    var magnification = height / theight;
    var width = twidth * magnification;           
    var x1 = x - this.kerning*magnification;
    var x2 = (x1 + width);
    if (rightaligned)
    {   x2 = x + this.kerning*magnification;
        x1 = x2-width;              
    }
    var y1 = y;
    var y2 = (y + height);
    var c0 = (argb>>16) & 0xff;
    var c1 = (argb>>8)  & 0xff; 
    var c2 = (argb>>0)  & 0xff;    
    var c3 = (argb>>24) & 0xff;   
                        
    var b = this.bufferCorner;
    var pos = 2*4*this.numGlyphs;
    b[pos+0] = x1;
    b[pos+1] = y1;
    b[pos+2] = x2;
    b[pos+3] = y1;
    b[pos+4] = x1;
    b[pos+5] = y2;
    b[pos+6] = x2;
    b[pos+7] = y2;    
    b = this.bufferTextureCoordinates;
    pos = 2*4*this.numGlyphs;    
    b[pos+0] = tx1;
    b[pos+1] = ty1;
    b[pos+2] = tx2;
    b[pos+3] = ty1;
    b[pos+4] = tx1;
    b[pos+5] = ty2;
    b[pos+6] = tx2;
    b[pos+7] = ty2;
    b = this.bufferColor;
    pos = 4*4*this.numGlyphs;
    b[pos+0] = c0;
    b[pos+1] = c1;
    b[pos+2] = c2;
    b[pos+3] = c3;
    b[pos+4] = c0;
    b[pos+5] = c1;
    b[pos+6] = c2;
    b[pos+7] = c3;
    b[pos+8] = c0;
    b[pos+9] = c1;
    b[pos+10] = c2;
    b[pos+11] = c3;
    b[pos+12] = c0;
    b[pos+13] = c1;
    b[pos+14] = c2;
    b[pos+15] = c3;    
    b = this.bufferDistanceThreshold;
    pos = 4*this.numGlyphs;
    b[pos+0] = weight;
    b[pos+1] = weight;
    b[pos+2] = weight;
    b[pos+3] = weight;

    this.numGlyphs++;
    
    return width - 1*this.kerning*magnification;         
};
    
TextRenderer.prototype.flush = function()
{
        if (this.numGlyphs<1) return;
        
        var gl = this.gl;
        
        // transfer buffers into opengl 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, 
            this.bufferCorner.subarray(0,this.numGlyphs*2*4) );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);        
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, 
            this.bufferColor.subarray(0,this.numGlyphs*4*4) );
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTextureCoordinates);       
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, 
            this.bufferTextureCoordinates.subarray(0,this.numGlyphs*2*4) );

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboDistanceThreshold);        
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, 
            this.bufferDistanceThreshold.subarray(0,this.numGlyphs*4) );
    
        // set up gl for painting all triangles
        gl.useProgram(this.program);
        
        // set texture unit 0 to use the texture and tell shader to use texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.txFont);
        gl.uniform1i(this.uTexture, 0);
        
        // enable all vertex attribute arrays and set pointers
        gl.enableVertexAttribArray(this.aCorner);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboCorner);
        gl.vertexAttribPointer(this.aCorner, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(this.aColor);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboColor);
        gl.vertexAttribPointer(this.aColor, 4, gl.UNSIGNED_BYTE, false, 0, 0);

        gl.enableVertexAttribArray(this.aTextureCoordinates);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboTextureCoordinates);
        gl.vertexAttribPointer(this.aTextureCoordinates, 2, gl.SHORT, false, 0, 0);

        gl.enableVertexAttribArray(this.aDistanceThreshold);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vboDistanceThreshold);
        gl.vertexAttribPointer(this.aDistanceThreshold, 1, gl.FLOAT, false, 0, 0);

        // set uniform data 
        gl.uniformMatrix4fv(this.uMVPMatrix, false, this.matrix);
        gl.uniform2f (this.uTextureSize, this.textureSize[0], this.textureSize[1]);

        // Draw all quads in one big call
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iboIndex);
        gl.drawElements(gl.TRIANGLES,6*this.numGlyphs, gl.UNSIGNED_SHORT, 0);

        // disable arrays
        gl.disableVertexAttribArray(this.aCorner);
        gl.disableVertexAttribArray(this.aColor);
        gl.disableVertexAttribArray(this.aTextureCoordinates);
        gl.disableVertexAttribArray(this.aDistanceThreshold);
        
        this.numGlyphs = 0;
};
    
    
TextRenderer.prototype.determineSubStringWidth = function(string, start, length, height)
{   var total = 0;
    for (var i=start; i<start+length; i++)
    {   total += this.determineGlyphWidth(string.charCodeAt(i), height);
    }
    return total;   
};

TextRenderer.prototype.determineStringWidth = function(string, height)
{   var total = 0;
    var len = string.length;
    for (var i=0; i<len; i++)
    {   total += this.determineGlyphWidth(string.charCodeAt(i), height);
    }
    return total;
};

TextRenderer.prototype.determineNumberWidth = function(number, height)
{   var total = 0;
    if (number<0)
    {   total = this.determineGlyphWidth(32,height);  
        number = -number;
    }
    do
    {   var lastdigit = number % 10;
        total += this.determineGlyphWidth(48+lastdigit,height);
        number = Math.floor(number/10);
    } while (number>0);
    return total;
};

TextRenderer.prototype.determineGlyphWidth = function(c, height)
{   var w = 0;
    if (c<this.glyph_coordinates.length)
    {   var coordinates = this.glyph_coordinates[c];
        if (coordinates!==null)
        {   var twidth = coordinates[2];
            var theight = coordinates[3];                               
            var magnification = height / theight;
            w = ((twidth*magnification) - (this.kerning*magnification));
        }
    }
    return w;
};


TextRenderer.prototype.wordWrap = function(string, height, pagewidth)
{       var v = [];
    
        var start = 0;
        var len = string.length;
        while (start<len)
        {   // skip spaces at start of lines
            if (string.charCodeAt(start)==32)
            {   start++;
            }           
            else
            {   // search until find the biggest still fitting string
                var endthatfits = start;
                var endofwords = string.indexOf(" ",start);
                if (endofwords<0) endofwords=len;
                while (this.determineSubStringWidth(string, start,endofwords-start, height) < pagewidth)
                {   endthatfits = endofwords;
                    if (endofwords==len)
                    {   break;
                    }
                    else
                    {   endofwords = string.indexOf(" ",endofwords+1);
                        if (endofwords<0)
                        {   endofwords=len;
                        }
                    }                   
                }
                // if some fitting text was found, put it into line
                if (endthatfits>start)
                {   v.push(string.substring(start,endthatfits));
                    start=endthatfits;
                }               
                // otherwise use the whole next word even if it does not fit
                else
                {   v.push(string.substring(start,endofwords));
                    start=endofwords;
                }
            }
        }           

        return v;       
};
    
TextRenderer.prototype.addString = function(string, x, y, height, rightaligned, argb, weight)
{       
// console.warn("addString",string,x,y,height,rightaligned,argb,weight);
        var x2 = x;
        if (rightaligned)
        {   for (var i=string.length-1; i>=0; i--)
            {   x2 -= this.addGlyph(string.charCodeAt(i), x2,y,height, rightaligned, argb, weight);  
            }       
        }
        else
        {   for (var i=0; i<string.length; i++)
            {   x2 += this.addGlyph(string.charCodeAt(i), x2,y,height, rightaligned, argb, weight);  
            }
        }
        return x2;
};
    
TextRenderer.prototype.addNumber = function(number, x, y, height, rightaligned, argb, weight)
{
        var x2 = x;
        var minussign=false;
        if (number<0)
        {   minussign = true;
            number = -number;
        }
        if (rightaligned)
        {   do
            {   var lastdigit = number % 10;
                x2 -= this.addGlyph(48+lastdigit, x2,y,height, rightaligned, argb, weight);
                number = Math.floor(number/10);
            } while (number>0);
            if (minussign)
            {   x2 -= this.addGlyph (45, x2,y,height, rightaligned, argb, weight);
            }
        }
        else        
        {   if (minussign)
            {   x2 += this.addGlyph (45, x2,y,height, rightaligned, argb, weight);
            }
            var highestdigit = 1;
            while (number>=highestdigit*10)
            {   highestdigit*=10;
            } 
            while (highestdigit>0)
            {   
                var digit = (number / highestdigit) % 10;
                x2 += this.addGlyph(48 + digit, x2,y,height,rightaligned, argb, weight);
                highestdigit = Math.floor(highestdigit/10);
            }
        }
        return x2;
};   
    
