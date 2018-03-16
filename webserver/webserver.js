'use strict';
const express = require('express');

var app = express();
app.use('/', express.static("../game/"));
app.listen(80, "");

console.log("Webserver running, open game in browser from http://localhost/launch.html");
