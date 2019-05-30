// package: cochlear.full.v1
// file: CochlearaiSenseClient.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as CochlearaiSenseClient_pb from "./CochlearaiSenseClient_pb";

interface ICochlearaiSenseService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    cochlearai: ICochlearaiSenseService_Icochlearai;
    cochlearai_stream: ICochlearaiSenseService_Icochlearai_stream;
}

interface ICochlearaiSenseService_Icochlearai extends grpc.MethodDefinition<CochlearaiSenseClient_pb.Request, CochlearaiSenseClient_pb.Response> {
    path: string; // "/cochlear.full.v1.CochlearaiSense/cochlearai"
    requestStream: boolean; // true
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<CochlearaiSenseClient_pb.Request>;
    requestDeserialize: grpc.deserialize<CochlearaiSenseClient_pb.Request>;
    responseSerialize: grpc.serialize<CochlearaiSenseClient_pb.Response>;
    responseDeserialize: grpc.deserialize<CochlearaiSenseClient_pb.Response>;
}
interface ICochlearaiSenseService_Icochlearai_stream extends grpc.MethodDefinition<CochlearaiSenseClient_pb.RequestStream, CochlearaiSenseClient_pb.Response> {
    path: string; // "/cochlear.full.v1.CochlearaiSense/cochlearai_stream"
    requestStream: boolean; // true
    responseStream: boolean; // true
    requestSerialize: grpc.serialize<CochlearaiSenseClient_pb.RequestStream>;
    requestDeserialize: grpc.deserialize<CochlearaiSenseClient_pb.RequestStream>;
    responseSerialize: grpc.serialize<CochlearaiSenseClient_pb.Response>;
    responseDeserialize: grpc.deserialize<CochlearaiSenseClient_pb.Response>;
}

export const CochlearaiSenseService: ICochlearaiSenseService;

export interface ICochlearaiSenseServer {
    cochlearai: grpc.handleClientStreamingCall<CochlearaiSenseClient_pb.Request, CochlearaiSenseClient_pb.Response>;
    cochlearai_stream: grpc.handleBidiStreamingCall<CochlearaiSenseClient_pb.RequestStream, CochlearaiSenseClient_pb.Response>;
}

export interface ICochlearaiSenseClient {
    cochlearai(callback: (error: grpc.ServiceError | null, response: CochlearaiSenseClient_pb.Response) => void): grpc.ClientWritableStream<CochlearaiSenseClient_pb.Request>;
    cochlearai(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: CochlearaiSenseClient_pb.Response) => void): grpc.ClientWritableStream<CochlearaiSenseClient_pb.Request>;
    cochlearai(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: CochlearaiSenseClient_pb.Response) => void): grpc.ClientWritableStream<CochlearaiSenseClient_pb.Request>;
    cochlearai(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: CochlearaiSenseClient_pb.Response) => void): grpc.ClientWritableStream<CochlearaiSenseClient_pb.Request>;
    cochlearai_stream(): grpc.ClientDuplexStream<CochlearaiSenseClient_pb.RequestStream, CochlearaiSenseClient_pb.Response>;
    cochlearai_stream(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<CochlearaiSenseClient_pb.RequestStream, CochlearaiSenseClient_pb.Response>;
    cochlearai_stream(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<CochlearaiSenseClient_pb.RequestStream, CochlearaiSenseClient_pb.Response>;
}

export class CochlearaiSenseClient extends grpc.Client implements ICochlearaiSenseClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public cochlearai(callback: (error: grpc.ServiceError | null, response: CochlearaiSenseClient_pb.Response) => void): grpc.ClientWritableStream<CochlearaiSenseClient_pb.Request>;
    public cochlearai(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: CochlearaiSenseClient_pb.Response) => void): grpc.ClientWritableStream<CochlearaiSenseClient_pb.Request>;
    public cochlearai(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: CochlearaiSenseClient_pb.Response) => void): grpc.ClientWritableStream<CochlearaiSenseClient_pb.Request>;
    public cochlearai(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: CochlearaiSenseClient_pb.Response) => void): grpc.ClientWritableStream<CochlearaiSenseClient_pb.Request>;
    public cochlearai_stream(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<CochlearaiSenseClient_pb.RequestStream, CochlearaiSenseClient_pb.Response>;
    public cochlearai_stream(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<CochlearaiSenseClient_pb.RequestStream, CochlearaiSenseClient_pb.Response>;
}
