import { CochlearSense, SamplingFormat } from "../build/CochlearSense";
import * as portAudio from "naudiodon"; 
const SECOND_RECORDING = 10;

if(portAudio.getDevices().length === 0) {
    console.error("No microphones are available for recording.");
} else {
    const apiKey=process.env.SENSE_API_KEY;
    const cochlearClient = new CochlearSense(apiKey);

    const samplingRate = 22050;
    const audioInput = new portAudio.AudioIO({
        inOptions: {
            channelCount: 1,
            sampleFormat: portAudio.SampleFormat32Bit,
            sampleRate: samplingRate,
            deviceId: -1,    
        }
    });

    const streamSense = cochlearClient.sendStream(audioInput, samplingRate, SamplingFormat.Int32Bit);
    //You can also run the streamSense.music and streamSense.speech method
    streamSense.event((err, result) => {
        if(err) console.error(err);
        else console.log(result);
    });

    audioInput.start()
    setTimeout(() => {
        audioInput.destroy();
    }, SECOND_RECORDING*1000)
}
