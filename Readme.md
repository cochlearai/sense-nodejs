# sense-nodejs

This repository implement a library working with nodejs to interact with Cochlear.ai backend.


## Dependencies 

Nodejs-client library depends on `grpc`, `google-protobuf` and `protobufjs`.


## How to use

Make sure to have install `node` and `npm`.

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