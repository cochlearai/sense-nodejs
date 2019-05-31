# nodejs-client

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

This command is doing two things : 
- Creating protobuff and grpc files definition that will be used by the library
- Building and bundling the library in one js file.

You can have access to all library file in the `./build` folder.

### Testing

```
npm run test
```

The test is running in parallel streaming audio and file audio analysis.
Port audio can print lot of error message. It's not a problem.
You'll read streaming analyse result every 0.5 second.
The file analyse result will appeared in the middle in this results. It's normal.
The test will record audio for 10 second and then stop.