// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var SenseClient_pb = require('./SenseClient_pb.js');

function serialize_sense_full_v1_Audio(arg) {
  if (!(arg instanceof SenseClient_pb.Audio)) {
    throw new Error('Expected argument of type sense.full.v1.Audio');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sense_full_v1_Audio(buffer_arg) {
  return SenseClient_pb.Audio.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sense_full_v1_CochlSense(arg) {
  if (!(arg instanceof SenseClient_pb.CochlSense)) {
    throw new Error('Expected argument of type sense.full.v1.CochlSense');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sense_full_v1_CochlSense(buffer_arg) {
  return SenseClient_pb.CochlSense.deserializeBinary(new Uint8Array(buffer_arg));
}


var CochlService = exports.CochlService = {
  sensefile: {
    path: '/sense.full.v1.Cochl/sensefile',
    requestStream: true,
    responseStream: false,
    requestType: SenseClient_pb.Audio,
    responseType: SenseClient_pb.CochlSense,
    requestSerialize: serialize_sense_full_v1_Audio,
    requestDeserialize: deserialize_sense_full_v1_Audio,
    responseSerialize: serialize_sense_full_v1_CochlSense,
    responseDeserialize: deserialize_sense_full_v1_CochlSense,
  },
  sensestream: {
    path: '/sense.full.v1.Cochl/sensestream',
    requestStream: true,
    responseStream: true,
    requestType: SenseClient_pb.Audio,
    responseType: SenseClient_pb.CochlSense,
    requestSerialize: serialize_sense_full_v1_Audio,
    requestDeserialize: deserialize_sense_full_v1_Audio,
    responseSerialize: serialize_sense_full_v1_CochlSense,
    responseDeserialize: deserialize_sense_full_v1_CochlSense,
  },
};

exports.CochlClient = grpc.makeGenericClientConstructor(CochlService);
