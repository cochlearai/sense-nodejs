import { Sense, CallbackType } from './Sense';
import { Readable } from "stream";
import { RequestStream, Response } from "../proto/CochlearaiSenseClient_pb";
import { CochlearaiSenseClient as CochlearGrpc } from "../proto/CochlearaiSenseClient_grpc_pb";
import StreamChunkToBuffer from './StreamChunkToBuffer';
import { SamplingFormat } from './SamplingFormat'

export class AudioStreamConnection extends Sense {
    private rate: number;
    private apiKey: string
    private grpcClient: CochlearGrpc
    private stream: Readable;
    private samplingFormat: SamplingFormat

    constructor(stream: Readable, rate: number, samplingFormat: SamplingFormat, apiKey: string, grpcClient: CochlearGrpc){
        super();
        this.rate=rate;
        this.apiKey = apiKey;
        this.grpcClient = grpcClient;
        this.stream = stream;
        this.samplingFormat = samplingFormat;
    }

    event(callback: CallbackType){
        this.sendStream("event", callback);
    }

    speech(callback: CallbackType){
        this.sendStream("speech", callback);
    }

    music(callback: CallbackType){
        this.sendStream("music", callback);
    }

    private sendStream(task: string, callback: CallbackType){
        const timeOutMetadata = this.getTimeOut();
        const call = this.grpcClient.cochlearai_stream(timeOutMetadata);

        const onResult = this.callbackAdaptor(callback);
        const streamChunkToBuffer = new StreamChunkToBuffer(this.rate, this.samplingFormat);

        this.stream.on("data", (chunk: Uint8Array) => {
            streamChunkToBuffer.push(chunk);
            while(streamChunkToBuffer.isBufferReady()){
                const buffer = streamChunkToBuffer.consumeBuffer();
                const dataType = streamChunkToBuffer.getSamplingFormat();
                const request = this.createRequest(buffer, task, dataType);
                call.write(request);
            }
        });

        call.on("data", (response: Response) => {
            onResult(undefined, response);
        })

        const closeGrpcConnection = () => { call.end() };

        call.on("close", closeGrpcConnection);
        call.on("end", closeGrpcConnection);
        this.stream.on("close", closeGrpcConnection);
        this.stream.on("end", closeGrpcConnection);

        const closeOnError = (err: Error) => {
            onResult(err, undefined);
            closeGrpcConnection();
        };

        this.stream.on("error", closeOnError);
        call.on("error", closeOnError)
    }

    private createRequest(buffer: Uint8Array, task: string, dataType: string): RequestStream {
        const request = new RequestStream();
        request.setApikey(this.apiKey);
        request.setData(buffer);
        request.setTask(task);
        request.setSr(this.rate)
        request.setDtype(dataType)
        return request;
    }
}