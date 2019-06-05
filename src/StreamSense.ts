import { Readable } from "stream";
import { SenseClient as SenseClientGrpc } from "../proto/SenseClient_grpc_pb";
import { RequestStream, Response } from "../proto/SenseClient_pb";
import { SamplingFormat } from "./SamplingFormat";
import { CallbackType, Sense } from "./Sense";
import StreamChunkToBuffer from "./StreamChunkToBuffer";

export class AudioStreamConnection extends Sense {
    private rate: number;
    private apiKey: string;
    private grpcClient: SenseClientGrpc;
    private stream: Readable;
    private samplingFormat: SamplingFormat;

    constructor(stream: Readable,
                rate: number,
                samplingFormat: SamplingFormat,
                apiKey: string,
                grpcClient: SenseClientGrpc) {
        super();
        this.rate = rate;
        this.apiKey = apiKey;
        this.grpcClient = grpcClient;
        this.stream = stream;
        this.samplingFormat = samplingFormat;
    }

    public event(callback: CallbackType) {
        this.sendStream("event", callback);
    }

    public speech(callback: CallbackType) {
        this.sendStream("speech", callback);
    }

    public music(callback: CallbackType) {
        this.sendStream("music", callback);
    }

    private sendStream(task: string, callback: CallbackType) {
        const timeOutMetadata = this.getTimeOut();
        const call = this.grpcClient.sense_stream(timeOutMetadata);

        const onResult = this.callbackAdaptor(callback);
        const streamChunkToBuffer = new StreamChunkToBuffer(this.rate, this.samplingFormat);

        this.stream.on("data", (chunk: Uint8Array) => {
            streamChunkToBuffer.push(chunk);
            while (streamChunkToBuffer.isBufferReady()) {
                const buffer = streamChunkToBuffer.consumeBuffer();
                const dataType = streamChunkToBuffer.getSamplingFormat();
                const request = this.createRequest(buffer, task, dataType);
                call.write(request);
            }
        });

        call.on("data", (response: Response) => {
            onResult(undefined, response);
        });

        const closeGrpcConnection = () => { call.end(); };

        call.on("close", closeGrpcConnection);
        call.on("end", closeGrpcConnection);
        this.stream.on("close", closeGrpcConnection);
        this.stream.on("end", closeGrpcConnection);

        const closeOnError = (err: Error) => {
            onResult(err, undefined);
            closeGrpcConnection();
        };

        this.stream.on("error", closeOnError);
        call.on("error", closeOnError);
    }

    private createRequest(buffer: Uint8Array, task: string, dataType: string): RequestStream {
        const request = new RequestStream();
        request.setApikey(this.apiKey);
        request.setData(buffer);
        request.setTask(task);
        request.setSr(this.rate);
        request.setDtype(dataType);
        return request;
    }
}
