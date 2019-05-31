import { AudioConnection, CallbackType } from './AudioConnection';
import { Readable } from "stream";
import { RequestStream, Response } from "../proto/CochlearaiSenseClient_pb";
import { CochlearaiSenseClient as CochlearGrpc } from "../proto/CochlearaiSenseClient_grpc_pb";

export class AudioStreamConnection extends AudioConnection {
    private rate: number;
    private bufferSize: number;
    private apiKey: string
    private grpcClient: CochlearGrpc
    private stream: Readable;

    constructor(stream: Readable, rate: number, apiKey: string, grpcClient: CochlearGrpc){
        super();
        this.rate=rate;
        // Sending every 0.5 second (Rate / 2) a 32bit information: 4 Bytes
        this.bufferSize = rate * 4 / 2;
        this.apiKey = apiKey;
        this.grpcClient = grpcClient;
        this.stream = stream;
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

    sendStream(task: string, callback: CallbackType){
        const timeOutMetadata = this.getTimeOut();
        const call = this.grpcClient.cochlearai_stream(timeOutMetadata);
        let segment = new Uint8Array(this.bufferSize)
        let segmentSize = 0;
        let chunkOffset = 0;

        const onResult = this.callbackAdaptor(callback);

        call.on("data", (response: Response) => {
            onResult(undefined, response);
        })

        call.on("close", () => {
            call.end();
        })

        call.on("error", (error: Error) => {
            onResult(error, undefined);
            call.end();
        })

        call.on("end", () => {
            call.end();
        });

        this.stream.on("data", (chunk: Uint8Array) => {
            if(chunk.length > this.bufferSize){
                throw new Error("Streaming chunk is too large");
            }

            if(chunk.length + segmentSize >= this.bufferSize){
                chunkOffset = this.bufferSize - segmentSize;
                segment.set(chunk.slice(0, chunkOffset), segmentSize);

                const request = new RequestStream();
                request.setApikey(this.apiKey);
                request.setData(segment);
                request.setTask(task);
                request.setSr(this.rate)
                request.setDtype("int32")
                call.write(request);                
                segment = new Uint8Array(this.bufferSize)
                segmentSize = 0;
            }
            segment.set(chunkOffset === 0 ? chunk: chunk.slice(chunkOffset), segmentSize);

            segmentSize += chunk.length - chunkOffset;
            chunkOffset = 0;
        });

        this.stream.on("close", () => {
            call.end();
        });

        this.stream.on("error", (err) => {
            console.error(err);
            call.end();
        });

        this.stream.on("end", () => {
            call.end();
        });
    }
}