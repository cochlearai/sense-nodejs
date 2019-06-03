import { CochlearSense } from "../build/CochlearSense";
import { readFileSync } from "fs";

const callback = (err: Error, response: any) => {
    if(err){
        console.error(err);
    } else {
        console.log(response);
    }
}

// Initialisationof the client
// After this step, a grpc connection is open with cochlear.ai server
const apiKey=process.env.SENSE_API_KEY;
const cochlearClient = new CochlearSense(apiKey);

//Fetching a local file
const buffer = readFileSync("./audio_sample.mp3");
const extension = "mp3";

const fileSense = cochlearClient.sendFile(buffer, extension);
//You can also call music and speech method
fileSense.event(callback);



//Using microphone as audio stream
import * as portAudio from "naudiodon"; 
const SECOND_RECORDING = 10;

if(portAudio.getDevices().length === 0) {
    console.error("You don't have any availabe microphone to record");
} else {
    const audioInput = new portAudio.AudioIO({
        inOptions: {
            channelCount: 1,
            sampleFormat: portAudio.SampleFormat32Bit,
            sampleRate: 22050,
            deviceId: -1,    
        }
    });

    const streamSense = cochlearClient.sendStream(audioInput);
    //You can also run the music and speech method
    streamSense.event(callback);

    audioInput.start()
    setTimeout(() => {
        audioInput.destroy();
    }, SECOND_RECORDING*1000)

}

