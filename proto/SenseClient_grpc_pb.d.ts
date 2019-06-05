// package: sense.full.v1
// file: SenseClient.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as SenseClient_pb from "./SenseClient_pb";

interface ISenseService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sense: ISenseService_Isense;
    sense_stream: ISenseService_Isense_stream;
}

interface ISenseService_Isense extends grpc.MethodDefinition<SenseClient_pb.Request, SenseClient_pb.Response> {
    path: string; // "/sense.full.v1.Sense/sense"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<SenseClient_pb.Request>;
    requestDeserialize: grpc.deserialize<SenseClient_pb.Request>;
    responseSerialize: grpc.serialize<SenseClient_pb.Response>;
    responseDeserialize: grpc.deserialize<SenseClient_pb.Response>;
}
interface ISenseService_Isense_stream extends grpc.MethodDefinition<SenseClient_pb.RequestStream, SenseClient_pb.Response> {
    path: string; // "/sense.full.v1.Sense/sense_stream"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<SenseClient_pb.RequestStream>;
    requestDeserialize: grpc.deserialize<SenseClient_pb.RequestStream>;
    responseSerialize: grpc.serialize<SenseClient_pb.Response>;
    responseDeserialize: grpc.deserialize<SenseClient_pb.Response>;
}

export const SenseService: ISenseService;

export interface ISenseServer {
    sense: grpc.handleClientStreamingCall<SenseClient_pb.Request, SenseClient_pb.Response>;
    sense_stream: grpc.handleBidiStreamingCall<SenseClient_pb.RequestStream, SenseClient_pb.Response>;
}

export interface ISenseClient {
    sense(callback: (error: grpc.ServiceError | null, response: SenseClient_pb.Response) => void): grpc.ClientWritableStream<SenseClient_pb.Request>;
    sense(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: SenseClient_pb.Response) => void): grpc.ClientWritableStream<SenseClient_pb.Request>;
    sense(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: SenseClient_pb.Response) => void): grpc.ClientWritableStream<SenseClient_pb.Request>;
    sense(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: SenseClient_pb.Response) => void): grpc.ClientWritableStream<SenseClient_pb.Request>;
    sense_stream(): grpc.ClientDuplexStream<SenseClient_pb.RequestStream, SenseClient_pb.Response>;
    sense_stream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<SenseClient_pb.RequestStream, SenseClient_pb.Response>;
    sense_stream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<SenseClient_pb.RequestStream, SenseClient_pb.Response>;
}

export class SenseClient extends grpc.Client implements ISenseClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public sense(callback: (error: grpc.ServiceError | null, response: SenseClient_pb.Response) => void): grpc.ClientWritableStream<SenseClient_pb.Request>;
    public sense(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: SenseClient_pb.Response) => void): grpc.ClientWritableStream<SenseClient_pb.Request>;
    public sense(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: SenseClient_pb.Response) => void): grpc.ClientWritableStream<SenseClient_pb.Request>;
    public sense(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: SenseClient_pb.Response) => void): grpc.ClientWritableStream<SenseClient_pb.Request>;
    public sense_stream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<SenseClient_pb.RequestStream, SenseClient_pb.Response>;
    public sense_stream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<SenseClient_pb.RequestStream, SenseClient_pb.Response>;
}
