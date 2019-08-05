/// <reference types="node" />
import { SenseClient as SenseClientGrpc } from "../proto/SenseClient_grpc_pb";
import { CallbackType, Sense } from "./Sense";
export declare class AudioFileConnection extends Sense {
    private static BUFFER_SIZE;
    private buffer;
    private extension;
    private apiKey;
    private grpcClient;
    constructor(buffer: Buffer, extension: string, apiKey: string, grpcClient: SenseClientGrpc);
    event(callback: CallbackType): void;
    speech(callback: CallbackType): void;
    music(callback: CallbackType): void;
    private sendData;
    private createRequestIterator;
}
