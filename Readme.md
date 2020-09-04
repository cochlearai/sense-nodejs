# Sense Nodejs

This repository is splitted in two folders : 
- `cochl-sense` contains the source code of the cochlear.ai sense nodejs client
- `examples` contains examples sample

## Quick start

Go in examples folder

Install dependencies : `npm install`

Modify `apiKey` in `file.js` and `naudiodon.js` with one of your API key that you can get at https://dashboard.cochlear.ai

You can now inference a file : `node file.js`

Or inference audio from your microphone : `node naudiodon.js`

## Use the library

To use our library, install it by running `npm install cochl-sense`.

You can now import classes :
```js
const { FileBuilder, StreamBuilder, Datatype } = require("cochl-sense")
```

### File

`File` represents a class that can inference audio coming from an audio file.

An audio file is any source of audio data which duration is known at runtime.
Because duration is known at runtime, server will wait for the whole file to be received before 
to start inferencing. All inferenced data will be received in one payload.

A file can be for instance, a mp3 file stored locally, a wav file accessible from an url etc...

So far wav, flac, mp3, ogg, mp4 are supported.

If you are using another file encoding format, let us know at support@cochlear.ai so that we can priorize it in our internal roadmap.

`File` implements the following interface : 

```typescript
interface File {
    inference(): Promise<Result>;
}
```

When calling `inference`, a GRPC connection will be established with the backend, audio data of the file will be sent and a `Result` instance will be returned in case of success (described bellow).

Note that network is not reached until `inference` method is called.

Note that `inference` can be called only once per `File` instance.

To create a `File` instance, you need to use a `FileBuilder` instance. `FileBuilder` is following the builder pattern and calling its `build` method will create a `File` instance.

`FileBuider` implements the following interface :

```typescript
interface FileBuilder {
    /** api key of cochlear.ai projects available at https://dashboard.cochlear.ai */
    withAPIKey(key: string): FileBuilder;
    /** format of the audio file : can be mp3, flac, wav, ogg, etc... */
    withFormat(format: string): FileBuilder;
    /** data reader to the file data */
    withReader(reader: Buffer): FileBuilder;
    /** activate or not the smartfiltering (default off) */
    withSmartFiltering(smartFiltering: Boolean): Filebuilder;
    
    /** creates a File instance*/
    build(): File;
}
```

Note that `withAPIKey`, `withFormat` and `withReader` method needs to be called before calling the `build` method, otherwise an error will be thrown.

### Stream

`Stream` represents a class that can inference audio coming from an audio stream.

An audio stream is any source of data which duration is not known at runtime. 
Because duration is not known, server will inference audio as it comes. One second of audio will be required before the first result to be returned. After that, one result will be given every 0.5 second of audio.

A stream can be for instance, the audio data comming from a microphone, audio data comming from a web radio etc...

Streams can be stopped at any moment while inferencing.

For now, the only format that is supported for streaming is a raw data stream (PCM stream). 
Raw data being sent has to be a **mono channel** audio stream. Its sampling rate and data type (int16, int32, float32) has to be given to describe the raw audio data. 

For best performance, we recommand using a sampling rate of 22050Hz and data represented as float32.

Multiple results will be returned by calling a callback function.

If you are using another stream encoding format that is not supported, let us know at support@cochlear.ai so that we can priorize it in our internal roadmap.

`Stream` implements the following interface : 

```typescript
interface Stream {
    inference(callback: (err?: Error, resp?: Result) => any): void;
}
```

When calling `inference`, a GRPC connection will be established with the backend, audio data of the stream will be sent every 0.5s.
Once result is returned by the server, the `callback` function is called.

- `err` will be undefined in case of success
- `resp` will be undefined in case of failure


Note that network is not reached until `inference` method is called.

Note that inference can be called only once per `Stream` instance.

To create a `Stream` instance, you need to use a `StreamBuilder` instance. `StreamBuilder` is following the builder pattern and calling its `build` method will create a `Stream` instance.

`StreamBuider` implements the following interface :

```typescript
interface SrteamBuilder {
    /** api key of cochlear.ai projects available at dashboard.cochlear.ai */
    withApiKey(key: string): StreamBuilder;
    /** type of the pcm stream */
    withDataType(datatype: string): StreamBuilder;
    /** sampling rate of the pcm stream */
    withSamplingRate(samplingRate: number): StreamBuilder;
    /** data of the pcm stream */
    withStreamer(streamer: Readable): StreamBuilder;
    /** activate or not the smartfiltering (default off) */
    withSmartFiltering(smartFiltering: Boolean): StreamBuilder;
    
    /** creates a Stream instance*/
    build(): Stream;

    /** disable sampling rate check */
    deactivateLowSamplingRateWarning(): StreamBuilder;
    /** max number of events from previous inference to keep in memory */
    withMaxHistoryEventsSize(size: number): StreamBuilder;
}
```

Note that `withAPIKey`, `withDataType`, `withSamplingRate` and `withStreamer` method needs to be called before calling the `build` method, otherwise an error will be thrown.


### Result

Result is a class that is returned by both file and stream when calling `inference` method.

Multiple results will be returned by a stream by calling a callback function. For a file only one result will be returned.

`Result` implements the following interface :
```typescript
    /** returns all events */
    allEvents(): Event[];
    /** returns all events that match the "filter function" defined below */
    detectedEvents(): Event[];
    /** group events that match the "filter function" and shows segments of time of when events were detected */
    detectedEventTiming(): Map<string, Array<[number, number]>>;
    /** return only the "tag" of the event that match the "filter" function */
    detectedTags(): string[];
    /** returns the service name : "human-interaction" or "emergency" for instance*/
    service(): string;
    /** returns a raw json object containing service name and an array of events */
    toJSON(): string;
    /** use a filter function : that function takes an event as input and return a boolean. An event will be "detected" if the filter function returns true for that event */
    useDefaultFilter(): Result;
    /** the default filter is to consider all events as detected. So by default, allEvents() and detectedEvents() will return the same result */
    withFilter(filter: (ev: Event) => boolean): Result;
```

Note that if you are inferencing a stream, multiple results will be returned. By default, calling allEvents() will only returned the newly inferenced result.
It's possible to keep track of previous events of the stream. To do so, call the `withMaxEventsHistorySize` method on the `StreamBuilder` class. Its default value is 0,
and increasing it will allow to "remember" previous events. 

### Event

An event contains the following data :

```typescript
class Event {
    /** name of the detected event */
    tag: string;
    /** start timestamp of the detected event since the begining of the inference */
    startTime: number;
    /** end timestamp of the detected event since the begining of the inference */
    endTime: number;
    /** probablity for the event to happen. Its values is between 0 and 1 */
    probability: string;
}
```
