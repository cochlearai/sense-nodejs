const portAudio = require("naudiodon");
const { StreamBuilder, Datatype } = require("../cochl-sense/lib")

const apiKey = "< Enter API Key >"

const SECOND_RECORDING = 120;

if (portAudio.getDevices().length === 0) {
    console.error("No microphones are available for recording.");
    return
}

const samplingRate = 22050;

const audioInput = portAudio.AudioIO({
    inOptions: {
        deviceId: -1,
        channelCount: 1,
        sampleFormat: portAudio.SampleFormat32Bit,
        sampleRate: samplingRate,
    },
});

new StreamBuilder().withApiKey(apiKey)
    .withStreamer(audioInput)
    .withSamplingRate(samplingRate)
    .withDataType(Datatype.Int32)
    .withSmartFiltering(true)
    .build().inference((err, result) => {
        if (err) {
            console.error(err);
            return
        }
        console.log(result.detectedEventTiming());
    }
    )

audioInput.start();
setTimeout(() => {
    audioInput.destroy();
}, SECOND_RECORDING * 1000);
