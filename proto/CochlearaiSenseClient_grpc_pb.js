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
var CochlearaiSenseClient_pb = require('./CochlearaiSenseClient_pb.js');

function serialize_cochlear_full_v1_Request(arg) {
  if (!(arg instanceof CochlearaiSenseClient_pb.Request)) {
    throw new Error('Expected argument of type cochlear.full.v1.Request');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cochlear_full_v1_Request(buffer_arg) {
  return CochlearaiSenseClient_pb.Request.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cochlear_full_v1_RequestStream(arg) {
  if (!(arg instanceof CochlearaiSenseClient_pb.RequestStream)) {
    throw new Error('Expected argument of type cochlear.full.v1.RequestStream');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cochlear_full_v1_RequestStream(buffer_arg) {
  return CochlearaiSenseClient_pb.RequestStream.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cochlear_full_v1_Response(arg) {
  if (!(arg instanceof CochlearaiSenseClient_pb.Response)) {
    throw new Error('Expected argument of type cochlear.full.v1.Response');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cochlear_full_v1_Response(buffer_arg) {
  return CochlearaiSenseClient_pb.Response.deserializeBinary(new Uint8Array(buffer_arg));
}


var CochlearaiSenseService = exports.CochlearaiSenseService = {
  cochlearai: {
    path: '/cochlear.full.v1.CochlearaiSense/cochlearai',
    requestStream: true,
    responseStream: false,
    requestType: CochlearaiSenseClient_pb.Request,
    responseType: CochlearaiSenseClient_pb.Response,
    requestSerialize: serialize_cochlear_full_v1_Request,
    requestDeserialize: deserialize_cochlear_full_v1_Request,
    responseSerialize: serialize_cochlear_full_v1_Response,
    responseDeserialize: deserialize_cochlear_full_v1_Response,
  },
  cochlearai_stream: {
    path: '/cochlear.full.v1.CochlearaiSense/cochlearai_stream',
    requestStream: true,
    responseStream: true,
    requestType: CochlearaiSenseClient_pb.RequestStream,
    responseType: CochlearaiSenseClient_pb.Response,
    requestSerialize: serialize_cochlear_full_v1_RequestStream,
    requestDeserialize: deserialize_cochlear_full_v1_RequestStream,
    responseSerialize: serialize_cochlear_full_v1_Response,
    responseDeserialize: deserialize_cochlear_full_v1_Response,
  },
};

exports.CochlearaiSenseClient = grpc.makeGenericClientConstructor(CochlearaiSenseService);
