import { credentials } from "grpc";
import { Readable } from "stream";
import { SenseClient as SenseClientGrpc } from "../proto/SenseClient_grpc_pb";
import { AudioFileConnection } from "./FileSense";
import { SamplingFormat } from "./SamplingFormat";
import { Sense } from "./Sense";
import { AudioStreamConnection } from "./StreamSense";

export { SamplingFormat };

export class SenseClient {
    private grpcClient: SenseClientGrpc;
    private apiKey: string;

    constructor(apiKey: string, host: string = "34.80.243.56:50051") {
        this.grpcClient = new SenseClientGrpc(host, credentials.createInsecure());
        this.apiKey = apiKey;
    }

    public sendFile(buffer: Buffer, extension: string): Sense {
        return new AudioFileConnection(buffer, extension, this.apiKey, this.grpcClient);
    }

    public sendStream(stream: Readable, samplingRate: number, samplingFormat: SamplingFormat): Sense {
        return new AudioStreamConnection(stream, samplingRate, samplingFormat, this.apiKey, this.grpcClient);
    }
}
