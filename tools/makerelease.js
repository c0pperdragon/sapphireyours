// small node.js tool program to create a time-stamped release folder
// with a combined javascript file and only the necessary data files
// for the game 

var fs = require('fs');
var path = require('path');

function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}


var today = new Date();
var d = today.getUTCDate();
var m = today.getUTCMonth() + 1;
var y = today.getUTCFullYear();
var dest = "../../c0pperdragon.github.io/release" + y + (m<10 ? "0"+m : ""+m) + (d<10 ? "0"+d : ""+d);
console.log(dest);
fs.mkdirSync(dest);

var src = "../game";

copyFolderRecursiveSync(src+"/art", dest);
fs.mkdirSync(dest+"/gfx");
copyFileSync(src+"/gfx/font.png", dest+"/gfx");
copyFileSync(src+"/gfx/fontdesc.json", dest+"/gfx");
copyFolderRecursiveSync(src+"/sound", dest);
fs.mkdirSync(dest+"/levels");
copyFileSync(src+"/levels/all.json", dest+"/levels");
copyFileSync(src+"/start.html", dest);

var code = [
	fs.readFileSync(src+"/howler.js"),
    fs.readFileSync(src+"/src/logic/DiscardingStack.js"),    
    fs.readFileSync(src+"/src/logic/Level.js"),
    fs.readFileSync(src+"/src/logic/Logic.js"),
    fs.readFileSync(src+"/src/logic/Walk.js"),
    fs.readFileSync(src+"/src/renderer/Matrix.js"),
    fs.readFileSync(src+"/src/renderer/Renderer.js"),
    fs.readFileSync(src+"/src/renderer/VectorRenderer.js"),
    fs.readFileSync(src+"/src/renderer/TextRenderer.js"),
    fs.readFileSync(src+"/src/renderer/TileRenderer.js"),
    fs.readFileSync(src+"/src/renderer/LevelRenderer.js"),
    fs.readFileSync(src+"/src/sound/LevelSoundPlayer.js"),
    fs.readFileSync(src+"/src/game/Game.js"),
    fs.readFileSync(src+"/src/game/KeyEvent.js"),
    fs.readFileSync(src+"/src/button/Button.js"),
    fs.readFileSync(src+"/src/button/PauseButton.js"),    
    fs.readFileSync(src+"/src/screen/Screen.js"),
    fs.readFileSync(src+"/src/screen/LoadingScreen.js"),
    fs.readFileSync(src+"/src/screen/TestScreen.js"),
    fs.readFileSync(src+"/src/screen/LevelSelectionScreen.js"),
    fs.readFileSync(src+"/src/screen/GameScreen.js"),
    fs.readFileSync(src+"/src/screen/PauseMenu.js"),
    fs.readFileSync(src+"/src/screen/GamePadInputBuffer.js"),
    fs.readFileSync(src+"/src/screen/KeyboardToGamepadTranslator.js"),
    fs.readFileSync(src+"/src/screen/TouchInputGrid.js"),
    fs.readFileSync(src+"/src/screen/EditorScreen.js"),
    fs.readFileSync(src+"/src/screen/LevelSettingsDialog.js")
];
fs.writeFileSync(dest+"/sapphireyours.js", code.join("\n"));
