import { Metadata } from "grpc";
import { Response } from "../proto/SenseClient_pb";
export declare type CallbackType = (error: Error, result: any) => any;
export declare abstract class Sense {
    private static TIMEOUT;
    abstract event(callback: CallbackType): void;
    abstract music(callback: CallbackType): void;
    abstract speech(callback: CallbackType): void;
    protected callbackAdaptor: (callback: CallbackType) => (error: Error, response: Response) => void;
    protected getTimeOut(): Metadata;
}
