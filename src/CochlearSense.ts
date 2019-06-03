import { CochlearaiSenseClient as CochlearGrpc } from "../proto/CochlearaiSenseClient_grpc_pb";
import { credentials } from "grpc";
import { Readable } from 'stream';
import { AudioFileConnection } from "./FileSense";
import { AudioStreamConnection } from "./StreamSense";
import { Sense } from './Sense';
import { SamplingFormat } from "./SamplingFormat";


export { SamplingFormat };

export class CochlearSense {
    private grpcClient: CochlearGrpc
    private apiKey: string

    constructor(apiKey: string, host: string = "35.229.175.68:50051"){
        this.grpcClient = new CochlearGrpc(host, credentials.createInsecure());
        this.apiKey = apiKey
    }

    sendFile(buffer: Buffer, extension: string): Sense {
        return new AudioFileConnection(buffer, extension, this.apiKey, this.grpcClient);
    }

    sendStream(stream: Readable, samplingRate: number, samplingFormat: SamplingFormat): Sense {
        return new AudioStreamConnection(stream, samplingRate, samplingFormat, this.apiKey, this.grpcClient);
    }
}