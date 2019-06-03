"use strict";
exports.__esModule = true;
var CochlearSense_1 = require("../build/CochlearSense");
var portAudio = require("naudiodon");
var SECOND_RECORDING = 10;
if (portAudio.getDevices().length === 0) {
    console.error("No microphones are available for recording.");
}
else {
    var apiKey = process.env.SENSE_API_KEY;
    var cochlearClient = new CochlearSense_1.CochlearSense(apiKey);
    var audioInput_1 = new portAudio.AudioIO({
        inOptions: {
            channelCount: 1,
            sampleFormat: portAudio.SampleFormat32Bit,
            sampleRate: 22050,
            deviceId: -1
        }
    });
    var streamSense = cochlearClient.sendStream(audioInput_1);
    //You can also run the streamSense.music and streamSense.speech method
    streamSense.event(function (err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    });
    audioInput_1.start();
    setTimeout(function () {
        audioInput_1.destroy();
    }, SECOND_RECORDING * 1000);
}
