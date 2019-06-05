import { SenseClient as SenseClientGrpc } from "../proto/SenseClient_grpc_pb";
import { Request } from "../proto/SenseClient_pb";
import { CallbackType, Sense } from "./Sense";

export class AudioFileConnection extends Sense {
    private static BUFFER_SIZE = 1024 * 1024; // 1 MB
    private buffer: Buffer;
    private extension: string;
    private apiKey: string;
    private grpcClient: SenseClientGrpc;

    constructor(buffer: Buffer, extension: string, apiKey: string, grpcClient: SenseClientGrpc) {
        super();
        this.buffer = buffer;
        this.extension = extension;
        this.apiKey = apiKey;
        this.grpcClient = grpcClient;
    }

    public event(callback: CallbackType) {
        this.sendData("event", callback);
    }

    public speech(callback: CallbackType) {
        this.sendData("speech", callback);
    }

    public music(callback: CallbackType) {
        this.sendData("music", callback);
    }

    private sendData(task: string, callback: CallbackType) {
        const timeOutMetadata = this.getTimeOut();
        const call = this.grpcClient.sense(timeOutMetadata, this.callbackAdaptor(callback));

        const requestsIterator = this.createRequestIterator(task);
        for ( const request of requestsIterator) {
            call.write(request);
        }
        call.end();
    }

    private *createRequestIterator(task: string): IterableIterator<Request> {
        const n = AudioFileConnection.BUFFER_SIZE;
        for (let i = 0; i < this.buffer.length / n; i++) {
            const segment = this.buffer.slice(i * n, (i + 1) * n);
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
