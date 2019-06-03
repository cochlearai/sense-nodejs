import { Metadata } from 'grpc';
import { Response } from "../proto/CochlearaiSenseClient_pb";

export type CallbackType = (error: Error, result: any) => any

export abstract class Sense {
    private static TIMEOUT = 10; //in second

    event(callback: CallbackType){}
    music(callback: CallbackType){}
    speech(callback: CallbackType){}

    protected callbackAdaptor = (callback: CallbackType) => (error: Error, response: Response) => {
        if(error){
            callback(error, undefined);
        } else {
            const json = JSON.parse(response.getOutputs());
            callback(error, json);
        }
    }

    protected getTimeOut(): Metadata{
        const metadata = new Metadata();
        const timeout = new Date().setSeconds(new Date().getSeconds() + Sense.TIMEOUT);
        metadata.set('deadline', timeout.toString());
        return metadata;
    }
}