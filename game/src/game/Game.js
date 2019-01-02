"use strict";
var Game = function()  
{   this.canvas = null;
    this.overlay = null;
    this.gl = null;
    this.exitcall = null;
    
    this.screenwidth = 0;        // size of surface in css units
    this.screenheight = 0;  
    this.pixelwidth = 0;         // size in true pixels (renderer will scale)
    this.pixelheight = 0;    
    this.pixeltilesize = 0;      // size of one tile in true pixels
    
    this.levelRenderer = null;
    this.textRenderer = null;
    this.vectorRenderer = null;

    this.soundPlayer = null;
    this.musicPlayer = null;
    this.musicName = null;

    this.screens = null;
    this.needRedraw = false;
    this.usingKeyboardInput = false;

    this.levels = null;    
    
    // input handling flags
    this.isTouch = false;
    this.isPointerDown = false;
};


Game.DEVELOPERMODE = false;
Game.DEFAULTSOLVEDGRADE = -3*60;  // 3 minutes waiting time before level is considered "known"

// construction of game object (handles loading of persistant state also)
Game.prototype.$ = function()
{
    var that = this;
    
    console.log("Starting up Sapphire Yours...");
    var options = 
    {   alpha: false,    
        stencil: false,
        antialias: false, 
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false
    };           
        
    this.canvas = document.getElementById("canvas");
    this.gl = this.canvas.getContext("webgl", options);
    if (!this.gl) { this.gl = this.canvas.getContext("experimental-webgl", options ); }        
    if (!this.gl) { return; }
    
    this.screens = [];

    // decide about initial sizes (also tile size in pixels)
    setScreenAndCanvasSize();

    // create the renderers and load data
    this.loadRenderers();
                       
    // default to touch/mouse input unless otherwise directed 
    this.usingKeyboardInput = false;

    // clear the music player object - will be immediately filled 
    this.musicPlayer = null;
    this.startMusic("silence");

    // show a loading screen at start
    this.addScreen(new LoadingScreen().$(this));
        
    // install input handlers
    document.addEventListener
    (   'keydown', function(event)
        {   if (!that.overlay) 
            {   that.onKeyDown(KeyEvent.toNumericCode(event.key)); 
            }
            if (event.key=="Tab")
            {   event.preventDefault();
            }
        }
    );
    document.addEventListener
    (   'keyup', function(event)
        {   if (!that.overlay) 
            {   that.onKeyUp(KeyEvent.toNumericCode(event.key)); 
            }
            if (event.key=="Tab") 
            {   event.preventDefault();
            }
        }
    );    
    document.addEventListener
    (   'keypress', function(event)
        {   if (event.key=="Tab") 
            {   event.preventDefault();
            }
        }
    );    
    this.canvas.addEventListener
    (   'mousedown', function(event)
        {   if (!that.overlay) that.onMouseDown(event); 
        }
    );
    this.canvas.addEventListener
    (   'mouseup', function(event)
        {   if (!that.overlay) that.onMouseUp(event);
        }
    );
    this.canvas.addEventListener
    (   'mousemove', function(event)
        {   if (!that.overlay) that.onMouseMove(event);
        }
    );
    this.canvas.addEventListener
    (   'mouseleave', function(event)
        {   if (!that.overlay) that.onMouseLeave(event);
        }
    );    
    this.canvas.addEventListener
    (   'mousewheel', function(event)
        {   if (event.wheelDelta>0) 
			{	that.onKeyDown(KeyEvent.UP);
				that.onKeyUp(KeyEvent.UP);
			}
			else
			{	that.onKeyDown(KeyEvent.DOWN);
				that.onKeyUp(KeyEvent.DOWN);
			}
        }
    );    
    this.canvas.addEventListener
    (   'touchstart', function(event)
        {   if (!that.overlay) that.onTouchStart(event);
        }
    );
    this.canvas.addEventListener
    (   'touchend', function(event)
        {   if (!that.overlay) that.onTouchEnd(event);
        }
    );
    this.canvas.addEventListener
    (   'touchcancel', function(event)
        {   if (!that.overlay) that.onTouchCancel(event);
        }
    );
    this.canvas.addEventListener
    (   'touchmove', function(event)
        {   if (!that.overlay) that.onTouchMove(event);
        }
    );
    
    // handle canvas size changes
    window.addEventListener
    (   'resize', function(event)
        {   var wbefore = that.screenwidth;
            var hbefore = that.screenheight;
            var pwbefore = that.pixelwidth;
            var phbefore = that.pixelheight;
            setScreenAndCanvasSize();
            if 
            (   wbefore!=that.screenwidth || hbefore!=that.screenheight
                || pwbefore!=that.pixelwidth || phbefore!=that.pixelheight
            ) 
            {   if (that.levelRenderer) { that.levelRenderer.loadOrReloadAllImages(); }                
                that.notifyScreensAboutResize(); 
                that.setDirty();
            }
        }
    );      
    
    // cause further loading to progress
    this.levels = [];
    
    // start in editor mode - no need to load integrated levels
    if (Game.geturlparameter("editor",null) != null)
    {   var l = new Level().$(null,null);
        that.replaceTopScreen(new EditorScreen().$(that,l)); 
        that.soundPlayer = (new LevelSoundPlayer()).$();
    } 
    // start game normally
    else
    {   this.loadIntegratedLevelPack
        (   "all.json",
            function() 
            {   that.replaceTopScreen(new LevelSelectionScreen().$(that));  
                that.soundPlayer = (new LevelSoundPlayer()).$();
            }
        );
    }
    
    // set up game loop
    window.requestAnimationFrame (ftick);    
    return this;
    
    function ftick() 
    {   that.tick();    // in case of exception stop the loop
        window.requestAnimationFrame(ftick);        
    }
        
    // computation for best canvas size
    function setScreenAndCanvasSize() 
    {   var ratio = window.devicePixelRatio || 1;
        var csswidth = Math.round(window.innerWidth);
        var cssheight = Math.round(window.innerHeight);
        var pixelwidth = Math.round(window.innerWidth*ratio);
        var pixelheight = Math.round(window.innerHeight*ratio);        
        that.screenwidth = csswidth;
        that.screenheight = cssheight;    
        that.pixelwidth = pixelwidth;
        that.pixelheight = pixelheight;        
        that.canvas.width = pixelwidth;
        that.canvas.height = pixelheight;   
        that.canvas.style["width"] = csswidth+"px";
        that.canvas.style["height"] = cssheight+"px";
        that.pixeltilesize = Math.round(ratio*30)*2; // always use even number of pixel 
        
//        console.log
//        (   "css size:",csswidth,cssheight,
//            "pixel size:",pixelwidth,pixelheight,
//            "tile size:",that.pixeltilesize
//        );
    }          
};
        
    
// ---------------- handling of global game information ---------
    
Game.prototype.setLevelSolvedGrade = function(level, solvedgrade)
{
//   console.log("setLevelSolvedGrade to "+solvedgrade);
   if (window.localStorage)
   {    
        window.localStorage[level.getHash()] = "" + solvedgrade;
//        console.log("stored",level.getHash(),""+solvedgrade);
   }
};  

Game.prototype.getLevelSolvedGrade = function(level)
{
    var sg = Game.DEFAULTSOLVEDGRADE;
    if (window.localStorage)
    {   var s = window.localStorage[level.getHash()];
        if (s)
        {   sg = parseInt(s);
        }
    }    
// console.log("getLevelSolvedGrade="+sg);    
    return sg;
};
        
Game.prototype.setMusicActive = function(active)
{
};

Game.prototype.getMusicActive = function()
{
    return false;
};      
    
    
Game.prototype.loadIntegratedLevelPack = function(filename, callback)
{
    var levels = this.levels;
    Game.getJSON
    (   "levels/"+filename, function(data) 
        {   if (data && data.length) 
            {   for (var i=0; i<data.length; i++)
                {   levels.push(new Level().$(null,data[i]));
                }
            }
            callback();
        }
    );
};

/** 
* Try to store a level into the local file system.
*/ 
     
Game.prototype.writeLevelToLocalSystem = function(l)
{
    var fileContents=JSON.stringify(l.toJSON(), null, 2);
    var fileName= l.filename === null ? "unnamed.sy" : l.filename;

    var pp = document.createElement('a');
    pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents));
    pp.setAttribute('download', fileName);
    pp.click();
};              

Game.prototype.loadLevelFromLocalSystem = function(callback)
{
//    console.log("try opening file picker");
    var pp = document.createElement('input');
    pp.setAttribute('type', 'file');
    pp.setAttribute('accept', '.sy');
    
    pp.addEventListener('change', function()
        {   
//        console.log("file picker change event: "+pp.files.length);
            if (pp.files.length>0)
            {   var fname = pp.files[0].name;
//                console.log("picked",fname);
        
                var reader = new FileReader();
                reader.addEventListener('loadend', function(e)
                    {   
//                       console.log("received file: "+reader.result);
                        callback( (new Level()).$(fname,JSON.parse(reader.result)) );
                    }
                );   
                reader.readAsText(pp.files[0]);
            }                
        }        
    );
    
    pp.click();
};

// constant game loop
Game.prototype.tick = function()
{
    // topmost screen always gets the tick action (other screens do not animate)
    if (this.screens.length>0)
    {   this.getTopScreen().tick();
    }
    
    // when anything changed in the display, redraw
    if (this.needRedraw) 
    {   if (this.allRenderersLoaded()) 
        {   this.needRedraw = false;
            try { this.draw(); } 
            catch (e) { console.warn(e); }            
        }
    }
};

Game.prototype.draw = function()
{
    var gl = this.gl;
    gl.viewport(0,0,this.pixelwidth,this.pixelheight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // paint current contents of all the screens begin from the bottom still visible screen
    var bottom = 0;
    for (var i=1; i<this.screens.length; i++)
    {   
        if (!this.screens[i].isOverlay())
        {   bottom = i; 
        }
    }
    
    for (var i=bottom; i<this.screens.length; i++)
    {   
//        console.log("draw",this.screens[i]);
        this.screens[i].draw();        
    }
    
    gl.disable(gl.BLEND);   

    var e = gl.getError();
    if (e) 
    {   console.log("WebGL error on drawing: "+e);
    }

};

Game.prototype.notifyScreensAboutResize = function()
{
    for (var i=0; i<this.screens.length; i++)
    {   this.screens[i].onResize();        
    }    
};

// -------------- handling of opening/closing screens and screens notifying changes -------
    
Game.prototype.setDirty = function()    
{   this.needRedraw = true;
};
    
    
Game.prototype.addScreen = function(screen)
{   this.screens.push(screen);
    this.setDirty();
};
    
Game.prototype.removeScreen = function()
{
    this.setDirty();
    if (this.screens.length<=1)
    {   // do not leave game completely
        // this.screens = [];
        // (this.exitcall)();      // after closing last remaining screen, try to exit program
    }
    else
    {   var olds = this.screens.pop();
        var news = this.screens[this.screens.length-1];
        olds.discard();         
        news.reactivate();
    }
};

Game.prototype.replaceTopScreen = function(screen)
{
    this.setDirty();
    var old = this.screens.pop();
    this.screens.push(screen);
    old.discard();
};
    
Game.prototype.getTopScreen = function()
{
    return this.screens.length>0 ? this.screens[this.screens.length-1] : null;
};

Game.prototype.openTextInputDialog = function(labeltext,initvalue, callback)
{
    this.overlay = document.createElement("div");
    this.overlay.style.position = "absolute";
    this.overlay.style.left = "0px";
    this.overlay.style.top = "0px";
    this.overlay.style.width = "100%";
    this.overlay.style.height = "100%";
    this.overlay.style["background-color"] = "black";
    
    var label = document.createElement("par");
    label.style["color"] = "white";
    label.style["font-family"] = "verdana";
    label.style["font-size"] = "2em";
    label.appendChild(document.createTextNode(labeltext));
    this.overlay.appendChild(label);  
   
    this.overlay.appendChild(document.createElement("br"));
    
    var input = document.createElement("input");
    input.type = "text";
    input.value = initvalue;
    input.style["color"] = "white";
    input.style["background-color"] = "black";
    input.style["font-family"] = "verdana";
    input.style["font-size"] = "2em";
    input.style["box-sizing"] = "border-box";
    input.style["border"] = "0.05em solid #9ecaed";
    input.style["border-radius"] = "0.1em";
    this.overlay.appendChild(input);      
    
    var that = this;
    input.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.key === "Escape") {
            if (that.overlay)
            {   var text = input.value;                
                var o = that.overlay;
                that.overlay = null;
                o.remove();
                callback(text);
                event.stopPropagation();
            }
        }
    });
    
    this.canvas.parentNode.appendChild(this.overlay);
    input.focus();      
};
        

// --------- loading renderers (will be triggered by system or by user key ----
Game.prototype.loadRenderers = function()
{   
    // (re)initialize renderers  (create opengl state)
    this.levelRenderer = null;      
    this.textRenderer = null;
    this.vectorRenderer = null;

    this.vectorRenderer = new VectorRenderer().$(this);
    console.log("VectorRenderer created");
    
    this.textRenderer = new TextRenderer().$(this);
    console.log("TextRenderer created");

    this.levelRenderer = new LevelRenderer().$(this);
    console.log("LevelRenderer created");      
    
    // check if any error has occured
    var e = this.gl.getError();
    if (e) 
    {   console.log("WebGL error on creating renderers: "+e);
    }
}
 
Game.prototype.allRenderersLoaded = function()
{
    return this.vectorRenderer && this.vectorRenderer.isLoaded() 
        && this.textRenderer && this.textRenderer.isLoaded() 
        && this.levelRenderer && this.levelRenderer.isLoaded();
}
 

// ---- handling of keyboard input events -----
Game.prototype.onKeyDown = function(keycode) 
{    
    this.usingKeyboardInput = true;
        
    if (this.screens.length>0 && (keycode==KeyEvent.X))
    {   this.getTopScreen().onBackNavigation();
    }
    else if (this.screens.length>0)
    {   this.getTopScreen().onKeyDown(keycode);
    }
};
Game.prototype.onKeyUp = function(keycode) 
{        
    if (this.screens.length>0)
    {
        this.getTopScreen().onKeyUp(keycode);
    }
};

// ---- handling of mouse events - translate to simplified "pointer" events ---
Game.prototype.onMouseDown = function(e)
{
    if (!this.isTouch) 
    {   var b = this.canvas.getBoundingClientRect();            
        var cx = Math.round( ((e.clientX-b.left)/b.width) * this.screenwidth );
        var cy = Math.round( ((e.clientY-b.top)/b.height) * this.screenheight ); 
        if (this.screens.length>0)
        {   if (this.isPointerDown)
            {   //console.log("pointer move: ",cx,cy);
                this.getTopScreen().onPointerMove(cx,cy);
            }
            else
            {   //console.log("pointer down: ",cx,cy);
                this.getTopScreen().onPointerDown(cx,cy);
            }
        }
        this.isPointerDown = true;             
    }        
};
Game.prototype.onMouseUp = function(e)
{
    if (!this.isTouch) 
    {   
        if (this.screens.length>0 && this.isPointerDown)
        {   //console.log("pointer up");
            this.getTopScreen().onPointerUp();
        }
        this.isPointerDown = false;
    }
};
Game.prototype.onMouseMove = function(e)
{
    if (!this.isTouch) 
    {   var b = this.canvas.getBoundingClientRect();            
        var cx = Math.round( ((e.clientX-b.left)/b.width) * this.screenwidth );
        var cy = Math.round( ((e.clientY-b.top)/b.height) * this.screenheight );
                
        if (this.screens.length>0 && this.isPointerDown)
        {   //console.log("pointer move: ",cx,cy);
            this.getTopScreen().onPointerMove(cx,cy);
        }
    }
};
Game.prototype.onMouseLeave = function(e) 
{ 
    if (!this.isTouch) 
    {   if (this.isPointerDown && this.screens.length>0)
        {   //console.log("pointer up");
            this.getTopScreen().onPointerUp();
        } 
        this.isPointerDown = false;
    }
};
        
// ----- handling of touch events - these are translated to pointer events --- 
Game.prototype.onTouchStart = function(e) 
{ 
};
Game.prototype.onTouchEnd = function(e)
{         
};
Game.prototype.onTouchCancel = function(e)
{
};
Game.prototype.onTouchMove = function(e)
{
};


// -------------- handling music playback --------

Game.prototype.startMusic = function(filename)
{
    // NOT YET IMPLEMENTED
};

Game.prototype.stopMusic = function()
{
    this.startMusic(null);
};

Game.prototype.startCategoryMusic = function (category)
{
    switch (category)
    {   case 0:  // "Fun"
            this.startMusic("Time");
            break;              
        case 1: // "Travel"
            this.startMusic("Calm");
            break;
        case 2: // "Action"
            this.startMusic("Action");
            break;
        case 3: // "Fight"
            this.startMusic("Granite");
            this.break;
        case 4: // "Puzzle"
            this.startMusic("Crystal");
            this.break;
        case 5: // "Science"
            this.startMusic("Only Solutions");
            break;
        case 6: // "Work"
            this.startMusic("Time");
            this.break;        
    }
};

    
// --------------------- static toolbox methods ------------------------------

Game.getColorForDifficulty = function(difficulty)
{
    switch(difficulty)
    {   case 1:  // previously Simple
        case 2:     // Easy
            return Game.argb(102,204,255);
        case 3:     // Moderate
            return Game.argb(38,139,255);
        case 4:     // Normal
            return Game.argb(51,204,20);
        case 5:     // Tricky
            return Game.argb(74,255,38);
        case 6:     // Tough
            return Game.argb(255,248,51);
        case 7:     // Difficult
            return Game.argb(255,128,0);
        case 8:     // Hard
            return Game.argb(255,36,20);
        case 9:     // M.A.D.
            return Game.argb(204,15,8);
        default:
            return Game.argb(170,170,170);
    }
};
    
Game.getNameForDifficulty = function(difficulty)
{
    switch(difficulty)
    {   case 1:  // previously Simple
        case 2:
            return "Easy";
        case 3:
            return "Moderate";
        case 4:
            return "Normal";
        case 5:
            return "Tricky";
        case 6:
            return "Tough";
        case 7:
            return "Difficult";
        case 8:
            return "Hard";
        case 9:
            return "M.A.D.";
        default:
            return "unrated";
    }
};

Game.getNameForCategory = function(category)    
{
    switch (category)
    {   case 0: 
            return "Fun";
        case 1:
            return "Travel";            
        case 2:
            return "Speed";
        case 3:
            return "Fighting";
        case 4: 
            return "Puzzle";
        case 5: 
            return "Science";
        case 6:
            return "Work";
        case 7:
            return "Survival";
        default:
            return "unknown";
    }
};

Game.getIconForCategory = function(category)    
{
    switch (category)
    {   case 0:  // Fun
            return 1;
        case 1:  // Travel
            return 2;
        case 2:  // Speed
            return 3;
        case 3:  // Fighting
            return 5;
        case 4:  // Puzzle
            return 6;
        case 5:  // Science
            return 7;
        case 6:  // Work
            return 8;
        case 7:  // Survival
            return 4;
        default:
            return "unknown";
    }
};

Game.getIconForDifficulty = function(difficulty)    
{
    return 9 + difficulty;
}

    
Game.argb = function(r, g, b)
{
    return 0xff000000 | (r<<16) | (g<<8) | (b<<0);
};


Game.getJSON = function(url, callback) 
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType("text/plain");
    xmlhttp.onreadystatechange = function() 
    {   if (this.readyState == 4)
        {   if (this.status == 200) 
            {   var myObj = JSON.parse(this.responseText);
                callback(myObj);
            }
            else
            {   callback(null);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};

Game.arraycopy = function(from,fromstart,to,tostart,length)
{
    if (from>to)
    {   for (var i=0; i<length; i++) to[tostart+i] = from[fromstart+i];
    }
    else
    {   for (var i=length-1; i>=0; i--) to[tostart+i] = from[fromstart+i];
    }    
};

Game.fillarray = function(a, value)
{   
    if (a.fill) 
    {   a.fill(value); 
    }
    else
    {   for (var i=0; i<a.length; i++) { a[i] = value; };
    }
};

Game.currentTimeMillis = function()
{
    return Date.now();
};


/** 
 * 	Create string of the form m:ss of a given number of seconds. 
 *  Only non-negative seconds work correctly.
 */ 
Game.buildTimeString = function(seconds)
{
    var s = seconds%60;
    var m = (seconds - s)/60;
    if (s>=10)
    {   return m+":"+s;
    }
    else
    {	return m+":0"+s;
    }			
};

// decode url parameters
Game.geturlparameter = function(key, defaultvalue) 
{   var urlparameters = {};
    if (window.location.search) {
      var chunks = window.location.search.replace("?","&").split("&");
      for (var i=0; i<chunks.length; i++) {
        var chunk = chunks[i];
        var eqidx = chunk.indexOf("=")
        if (eqidx>0) {
          var k = chunk.substring(0,eqidx);
          var v = decodeURIComponent(chunk.substring(eqidx+1)).trim();
          if (k===key) { return v; }
        }
      }
    }
    return defaultvalue;
}
