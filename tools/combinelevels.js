// small node.js tool program to join all levels in the levels/ folder
// into a big all.json file

var fs = require('fs');

function collect(path, arr)
{
    var list = fs.readdirSync(path);
    for (var i=0; list && i<list.length; i++)
    {   var f = list[i];
        console.log(f);
        if (f.endsWith(".sy"))
        {   var json = JSON.parse(fs.readFileSync(path+"/"+f));
            arr.push(json);
        }
        else if (!f.endsWith(".json"))
        {   collect(path + "/" + f, arr);
        }
    }
}

var arr = [];
collect("../game/levels", arr);
fs.writeFileSync("all.json", JSON.stringify(arr, null, 2));
