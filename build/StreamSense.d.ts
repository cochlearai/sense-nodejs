/// <reference types="node" />
import { Readable } from "stream";
import { SenseClient as SenseClientGrpc } from "../proto/SenseClient_grpc_pb";
import { SamplingFormat } from "./SamplingFormat";
import { CallbackType, Sense } from "./Sense";
export declare class AudioStreamConnection extends Sense {
    private rate;
    private apiKey;
    private grpcClient;
    private stream;
    private samplingFormat;
    constructor(stream: Readable, rate: number, samplingFormat: SamplingFormat, apiKey: string, grpcClient: SenseClientGrpc);
    event(callback: CallbackType): void;
    speech(callback: CallbackType): void;
    music(callback: CallbackType): void;
    private sendStream;
    private createRequest;
}
