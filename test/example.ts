import { CochlearSense } from "../build/CochlearSense";

import { readFileSync } from "fs";
import * as portAudio from "node-portaudio"; 

const apiKey=process.env.SENSE_API_KEY;
const client = new CochlearSense(apiKey);

const SECOND_RECORDING = 1000;

/*
const buffer = readFileSync("./audio_sample.mp3");
const extension = "mp3";
client.event(buffer, extension, (err, response) => {
    if(err){
        console.error(err);
    } else {
        console.log(response);
    }
})
*/


if(portAudio.getDevices().length === 0) {
    console.error("You don't have any availabe microphone to record");
} else {
    const audioInput = new portAudio.AudioInput({
        channelCount: 1,
        sampleFormat: portAudio.SampleFormat32Bit,
        sampleRate: 22050,
        deviceId: -1,
    });
    audioInput.start()
    setTimeout(() => {
        audioInput.destroy();
    }, SECOND_RECORDING*1000)
    

    client.sendStream(audioInput, "event", (err, response) => {
        console.log(err || response);
    });
}

