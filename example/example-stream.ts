import * as portAudio from "naudiodon";
import { SenseClient, SamplingFormat } from "../build/SenseClient";
const SECOND_RECORDING = 10;

if (portAudio.getDevices().length === 0) {
    console.error("No microphones are available for recording.");
} else {
    const apiKey = process.env.SENSE_API_KEY;
    const senseClient = new SenseClient(apiKey);

    const samplingRate = 22050;
    const audioInput = new portAudio.AudioIO({
        inOptions: {
            channelCount: 1,
            deviceId: -1,
            sampleFormat: portAudio.SampleFormat32Bit,
            sampleRate: samplingRate,
        },
    });

    const streamSense = senseClient.sendStream(audioInput, samplingRate, SamplingFormat.Int32Bit);
    // You can also run the streamSense.music and streamSense.speech method
    streamSense.event((err, result) => {
        if (err) {
            console.error(err);
        } else {
            console.log(JSON.stringify(result));
        }
    });

    audioInput.start();
    setTimeout(() => {
        audioInput.destroy();
    }, SECOND_RECORDING * 1000);
}
