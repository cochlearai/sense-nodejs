import { Request, Response, RequestStream } from "../proto/CochlearaiSenseClient_pb";
import { CochlearaiSenseClient as CochlearGrpc } from "../proto/CochlearaiSenseClient_grpc_pb";
import { credentials, Metadata } from "grpc";
import { Readable } from "stream";

type callbackType = (error: Error, response: string) => void;

export class CochlearSense {
    private grpcClient: CochlearGrpc
    private apiKey: string
    private static TIMEOUT = 10; //in second
    private static RATE = 22050;
    // Sending every 0.5 second (Rate / 2) a 32bit information: 4 Bytes
    private static BUFFER_SIZE = CochlearSense.RATE * 4 / 2;

    constructor(apiKey: string, host: string = "35.229.175.68:50051"){
        this.grpcClient = new CochlearGrpc(host, credentials.createInsecure());
        this.apiKey = apiKey
    }

    music(buffer: Buffer, extension: string, callback: callbackType){
        this.sendData(buffer, extension, "music", callback);
    }
    
    event(buffer: Buffer, extension: string, callback: callbackType){
        this.sendData(buffer, extension, "event", callback);
    }
   
    speech(buffer: Buffer, extension: string, callback: callbackType){
        this.sendData(buffer, extension, "speech", callback);
    }

    sendStream(stream: Readable,  task: string, callback: callbackType){
        const timeOutMetadata = this.getTimeOut();
        const call = this.grpcClient.cochlearai_stream(timeOutMetadata);
        let segment = new Uint8Array(CochlearSense.BUFFER_SIZE)
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

        stream.on("data", (chunk: Uint8Array) => {
            if(chunk.length > CochlearSense.BUFFER_SIZE){
                throw new Error("Streaming chunk is too large");
            }

            if(chunk.length + segmentSize >= CochlearSense.BUFFER_SIZE){
                chunkOffset = CochlearSense.BUFFER_SIZE - segmentSize;
                segment.set(chunk.slice(0, chunkOffset), segmentSize);

                const request = new RequestStream();
                request.setApikey(this.apiKey);
                request.setData(segment);
                request.setTask(task);
                request.setSr(CochlearSense.RATE)
                request.setDtype("int32")
                call.write(request);                
                segment = new Uint8Array(CochlearSense.BUFFER_SIZE)
                segmentSize = 0;
            }
            segment.set(chunkOffset === 0 ? chunk: chunk.slice(chunkOffset), segmentSize);

            segmentSize += chunk.length - chunkOffset;
            chunkOffset = 0;
        });

        stream.on("close", () => {
            call.end();
        });

        stream.on("error", (err) => {
            console.error(err);
            call.end();
        });

        stream.on("end", () => {
            call.end();
        });
    }

    private sendData(buffer: Buffer, extension: string, task: string, callback: callbackType){
        const timeOutMetadata = this.getTimeOut();
        const call = this.grpcClient.cochlearai(timeOutMetadata, this.callbackAdaptor(callback));

        const requestsIterator = this.createRequestIterator(buffer, extension, task);
        for( var request of requestsIterator){
            call.write(request);
        }
        call.end();
    }

    private callbackAdaptor = (callback: callbackType) => (error: Error, response: Response) => {
        if(error){
            callback(error, undefined);
        } else {
            callback(error, response.getOutputs());
        }
    }

    private getTimeOut(): Metadata{
        const metadata = new Metadata();
        const timeout = new Date().setSeconds(new Date().getSeconds() + CochlearSense.TIMEOUT);
        metadata.set('deadline', timeout.toString());
        return metadata;
    }
   
    private *createRequestIterator(buffer: Buffer, extension: string, task: string): IterableIterator<Request>{
        const n = CochlearSense.BUFFER_SIZE;
        for(var i = 0; i < buffer.length/n; i++){
            const segment = buffer.slice(i*n, (i+1) * n)
            const request = new Request();
            request.setApikey(this.apiKey);
            request.setData(segment);
            request.setFormat(extension);
            request.setTask(task);
            yield request;
        }
        return;
    }
}