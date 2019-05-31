import { Sense, CallbackType } from "./Sense";
import { CochlearaiSenseClient as CochlearGrpc } from "../proto/CochlearaiSenseClient_grpc_pb";
import { Request } from '../proto/CochlearaiSenseClient_pb';

export class AudioFileConnection extends Sense {
    private buffer: Buffer
    private extension: string
    private apiKey: string
    private grpcClient: CochlearGrpc
    private static BUFFER_SIZE = 1024*1024 //1 MB

    constructor(buffer: Buffer, extension: string, apiKey: string, grpcClient: CochlearGrpc){
        super();
        this.buffer=buffer;
        this.extension=extension;
        this.apiKey = apiKey;
        this.grpcClient = grpcClient;
    }

    event(callback: CallbackType){
        this.sendData("event", callback);
    }

    speech(callback: CallbackType){
        this.sendData("speech", callback);
    }

    music(callback: CallbackType){
        this.sendData("music", callback);
    }

    private sendData(task: string, callback: CallbackType){
        const timeOutMetadata = this.getTimeOut();
        const call = this.grpcClient.cochlearai(timeOutMetadata, this.callbackAdaptor(callback));

        const requestsIterator = this.createRequestIterator(task);
        for( var request of requestsIterator){
            call.write(request);
        }
        call.end();
    }

    private *createRequestIterator(task: string): IterableIterator<Request>{
        const n = AudioFileConnection.BUFFER_SIZE;
        for(var i = 0; i < this.buffer.length/n; i++){
            const segment = this.buffer.slice(i*n, (i+1) * n)
            const request = new Request();
            request.setApikey(this.apiKey);
            request.setData(segment);
            request.setFormat(this.extension);
            request.setTask(task);
            yield request;
        }
        return;
    }
}