"use strict";
exports.__esModule = true;
var CochlearSense_1 = require("../build/CochlearSense");
var fs_1 = require("fs");
var callback = function (err, response) {
    if (err) {
        console.error(err);
    }
    else {
        console.log(response);
    }
};
// Initialisationof the client
// After this step, a grpc connection is open with cochlear.ai server
var apiKey = process.env.SENSE_API_KEY;
var cochlearClient = new CochlearSense_1.CochlearSense(apiKey);
//Fetching a local file
var buffer = fs_1.readFileSync("./audio_sample.mp3");
var extension = "mp3";
var fileSense = cochlearClient.sendFile(buffer, extension);
//You can also call music and speech method
fileSense.event(callback);
//Using microphone as audio stream
var portAudio = require("naudiodon");
var SECOND_RECORDING = 10;
if (portAudio.getDevices().length === 0) {
    console.error("You don't have any availabe microphone to record");
}
else {
    var audioInput_1 = new portAudio.AudioIO({
        inOptions: {
            channelCount: 1,
            sampleFormat: portAudio.SampleFormat32Bit,
            sampleRate: 22050,
            deviceId: -1
        }
    });
    var streamSense = cochlearClient.sendStream(audioInput_1);
    //You can also run the music and speech method
    streamSense.event(callback);
    audioInput_1.start();
    setTimeout(function () {
        audioInput_1.destroy();
    }, SECOND_RECORDING * 1000);
}
