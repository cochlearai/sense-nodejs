"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var SenseClient_1 = require("../build/SenseClient");
var apiKey = process.env.SENSE_API_KEY;
var cochlearClient = new SenseClient_1.SenseClient(apiKey);
var buffer = fs_1.readFileSync("./audio_sample.mp3");
var extension = "mp3";
var fileSense = cochlearClient.sendFile(buffer, extension);
// You can also call fileSense.music and filseSense.speech method
fileSense.event(function (err, result) {
    if (err) {
        console.error(err);
    }
    else {
        console.log(JSON.stringify(result, null, 3));
    }
});
