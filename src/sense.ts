import { Request, Response } from "../client/CochlearaiSenseClient_pb";
import { CochlearaiSenseClient as CochlearGrpc } from "../client/CochlearaiSenseClient_grpc_pb";
import { credentials, Metadata } from "grpc";

type callBackType = (error: Error, response: string) => void;

export class CochlearSense {
    private grpcClient: CochlearGrpc
    private apiKey: string
    private static CHUNK_SIZE = 1024*1024; // 1 MB
    private static TIMEOUT = 10; //in second

    constructor(apiKey: string, host: string = "35.229.175.68:50051"){
        this.grpcClient = new CochlearGrpc(host, credentials.createInsecure());
        this.apiKey = apiKey
    }

    music(buffer: Buffer, extension: string, callback: callBackType){
        this.sendData(buffer, extension, "music", callback);
    }
    
    event(buffer: Buffer, extension: string, callback: callBackType){
        this.sendData(buffer, extension, "event", callback);
    }
   
    speech(buffer: Buffer, extension: string, callback: callBackType){
        this.sendData(buffer, extension, "speech", callback);
    }

    private sendData(buffer: Buffer, extension: string, task: string, callback: callBackType){
        const timeOutMetadata = this.getTimeOut();
        const call = this.grpcClient.cochlearai(timeOutMetadata, (error, response) => {
            if(error){
                callback(error, undefined);
            } else {
                callback(error, response.getOutputs());
            }
        });

        const requestsIterator = this.createRequestIterator(buffer, extension, task);
        for( var request of requestsIterator){
            call.write(request);
        }
        call.end();
    }

    private getTimeOut(): Metadata{
        const metadata = new Metadata();
        const timeout = new Date().setSeconds(new Date().getSeconds() + CochlearSense.TIMEOUT);
        metadata.set('deadline', timeout.toString());
        return metadata;
    }
   
    private *createRequestIterator(buffer: Buffer, extension: string, task: string): IterableIterator<Request>{
        const n = CochlearSense.CHUNK_SIZE;
        for(var i = 0; i < buffer.length/n; i++){
            const slice = buffer.slice(i*n, (i+1) * n)
            const request = new Request();
            request.setApikey(this.apiKey);
            request.setData(slice);
            request.setFormat(extension);
            request.setTask(task);
            yield request;
        }
        return;
    }
}