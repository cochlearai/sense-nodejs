/// <reference types="node" />
import { Readable } from "stream";
import { SamplingFormat } from "./SamplingFormat";
import { Sense } from "./Sense";
export { SamplingFormat };
export declare class SenseClient {
    private grpcClient;
    private apiKey;
    constructor(apiKey: string, host?: string);
    sendFile(buffer: Buffer, extension: string): Sense;
    sendStream(stream: Readable, samplingRate: number, samplingFormat: SamplingFormat): Sense;
}
