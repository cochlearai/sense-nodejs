// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var SenseClient_pb = require('./SenseClient_pb.js');

function serialize_sense_full_v1_Request(arg) {
  if (!(arg instanceof SenseClient_pb.Request)) {
    throw new Error('Expected argument of type sense.full.v1.Request');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_sense_full_v1_Request(buffer_arg) {
  return SenseClient_pb.Request.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sense_full_v1_RequestStream(arg) {
  if (!(arg instanceof SenseClient_pb.RequestStream)) {
    throw new Error('Expected argument of type sense.full.v1.RequestStream');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_sense_full_v1_RequestStream(buffer_arg) {
  return SenseClient_pb.RequestStream.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sense_full_v1_Response(arg) {
  if (!(arg instanceof SenseClient_pb.Response)) {
    throw new Error('Expected argument of type sense.full.v1.Response');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_sense_full_v1_Response(buffer_arg) {
  return SenseClient_pb.Response.deserializeBinary(new Uint8Array(buffer_arg));
}


var SenseService = exports.SenseService = {
  sense: {
    path: '/sense.full.v1.Sense/sense',
    requestStream: true,
    responseStream: false,
    requestType: SenseClient_pb.Request,
    responseType: SenseClient_pb.Response,
    requestSerialize: serialize_sense_full_v1_Request,
    requestDeserialize: deserialize_sense_full_v1_Request,
    responseSerialize: serialize_sense_full_v1_Response,
    responseDeserialize: deserialize_sense_full_v1_Response,
  },
  sense_stream: {
    path: '/sense.full.v1.Sense/sense_stream',
    requestStream: true,
    responseStream: true,
    requestType: SenseClient_pb.RequestStream,
    responseType: SenseClient_pb.Response,
    requestSerialize: serialize_sense_full_v1_RequestStream,
    requestDeserialize: deserialize_sense_full_v1_RequestStream,
    responseSerialize: serialize_sense_full_v1_Response,
    responseDeserialize: deserialize_sense_full_v1_Response,
  },
};

exports.SenseClient = grpc.makeGenericClientConstructor(SenseService);
