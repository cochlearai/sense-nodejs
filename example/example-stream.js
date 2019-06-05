"use strict";
exports.__esModule = true;
var portAudio = require("naudiodon");
var SenseClient_1 = require("../build/SenseClient");
var SECOND_RECORDING = 10;
if (portAudio.getDevices().length === 0) {
    console.error("No microphones are available for recording.");
}
else {
    var apiKey = process.env.SENSE_API_KEY;
    var senseClient = new SenseClient_1.SenseClient(apiKey);
    var samplingRate = 22050;
    var audioInput_1 = portAudio.AudioIO({
        inOptions: {
            channelCount: 1,
            deviceId: -1,
            sampleFormat: portAudio.SampleFormat32Bit,
            sampleRate: samplingRate
        }
    });
    var streamSense = senseClient.sendStream(audioInput_1, samplingRate, SenseClient_1.SamplingFormat.Int32Bit);
    // You can also run the streamSense.music and streamSense.speech method
    streamSense.event(function (err, result) {
        if (err) {
            console.error(err);
        }
        else {
            console.log(JSON.stringify(result));
        }
    });
    audioInput_1.start();
    setTimeout(function () {
        audioInput_1.destroy();
    }, SECOND_RECORDING * 1000);
}
