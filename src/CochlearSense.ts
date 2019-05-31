import { CochlearaiSenseClient as CochlearGrpc } from "../proto/CochlearaiSenseClient_grpc_pb";
import { credentials } from "grpc";
import { Readable } from 'stream';
import { AudioFileConnection } from "./AudioFileConnection";
import { AudioStreamConnection } from "./AudioStreamConnection";
import { AudioConnection } from './AudioConnection';

export class CochlearSense {
    private grpcClient: CochlearGrpc
    private apiKey: string

    constructor(apiKey: string, host: string = "35.229.175.68:50051"){
        this.grpcClient = new CochlearGrpc(host, credentials.createInsecure());
        this.apiKey = apiKey
    }

    file(buffer: Buffer, extension: string): AudioConnection {
        return new AudioFileConnection(buffer, extension, this.apiKey, this.grpcClient);
    }

    stream(stream: Readable): AudioConnection {
        return new AudioStreamConnection(stream, 22050, this.apiKey, this.grpcClient);
    }
}