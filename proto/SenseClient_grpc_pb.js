// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// Subin Lee (sblee@cochlear.ai)
//
// Copyright 2019 Cochlear.ai
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
'use strict';
var grpc = require('grpc');
var SenseClient_pb = require('./SenseClient_pb.js');

function serialize_sense_full_v1_Request(arg) {
  if (!(arg instanceof SenseClient_pb.Request)) {
    throw new Error('Expected argument of type sense.full.v1.Request');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sense_full_v1_Request(buffer_arg) {
  return SenseClient_pb.Request.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sense_full_v1_RequestStream(arg) {
  if (!(arg instanceof SenseClient_pb.RequestStream)) {
    throw new Error('Expected argument of type sense.full.v1.RequestStream');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_sense_full_v1_RequestStream(buffer_arg) {
  return SenseClient_pb.RequestStream.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_sense_full_v1_Response(arg) {
  if (!(arg instanceof SenseClient_pb.Response)) {
    throw new Error('Expected argument of type sense.full.v1.Response');
  }
  return Buffer.from(arg.serializeBinary());
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
