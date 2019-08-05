# cochl-sense (Sense API beta-v2)

This repository implement a library working with nodejs to interact with Cochlear.ai backend.
An API key is required for this library to work. You can get an API key on https://cochlear.ai/ website.

## Dependencies 

Nodejs-client library depends on `grpc`, `google-protobuf` and `protobufjs`.

## Use nodejs package 

Make sure to have `node` and `npm` installed.

Install cochl-sense nodejs client : 
`npm install cochl-sense`

### Analyse a file

If you want to analyse a file, run the following script.
(You will need to replace API-KEY and "./music.mp3" for your case).

```
const SenseClient = require("cochl-sense").SenseClient;
const fs  = require("fs");

const client = new SenseClient("API-KEY");
const buffer = fs.readFileSync("./music.mp3");
const extension = "mp3";

function callback(err, result){
	if(err){
		console.error(err);
	} else {
		console.log(JSON.stringify(result));
	}
}

client.sendFile(buffer,extension).event(callback);
```

### Analyse a stream
If you want to analyse a stream, our client needs to access your micrpophone. You can use for instance naudiodon : 
```
npm install naudiodon
```

And run the following script : (enter your API Key)
```
const portAudio = require("naudiodon");
const SenseClient = require("cochl-sense").SenseClient;
const SamplingFormat = require("cochl-sense").SamplingFormat;

var senseClient = new SenseClient("API-KEY");
var samplingRate = 22050;
var audioStream = portAudio.AudioIO({
	inOptions: {
	    channelCount: 1,
	    deviceId: -1,
	    sampleFormat: portAudio.SampleFormat32Bit,
	    sampleRate: samplingRate
	}
});

function callback(err,result) {
	if(err) {
		console.error(err);
	} else {
		console.log(JSON.stringify(result));
	}
}

senseClient.sendStream(audioStream, samplingRate, SamplingFormat.Int32Bit).event(callback);

audioStream.start();
```

## Build package from source

Make sure to have install `node` and `npm`.

Clone the github repository : https://github.com/cochlearai/sense-nodejs

### Initialisation

```
npm install
```

### Building

```
npm run build
```

This command build and bundle the library in one js file, and create the typescript definition file.

You can have access to all library file in the `./build` folder.

### Launch Examples

For testing a file, run 
```
npm run example-file
```

For testing a stream from your microphone, make sure  [port-audio](http://www.portaudio.com/) is installed on your system.
Then run 
```
npm run example-stream
```
