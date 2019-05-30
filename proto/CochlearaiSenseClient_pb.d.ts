// package: cochlear.full.v1
// file: CochlearaiSenseClient.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class Request extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): void;

    getTask(): string;
    setTask(value: string): void;

    getApikey(): string;
    setApikey(value: string): void;

    getFormat(): string;
    setFormat(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Request.AsObject;
    static toObject(includeInstance: boolean, msg: Request): Request.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Request, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Request;
    static deserializeBinaryFromReader(message: Request, reader: jspb.BinaryReader): Request;
}

export namespace Request {
    export type AsObject = {
        data: Uint8Array | string,
        task: string,
        apikey: string,
        format: string,
    }
}

export class RequestStream extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): void;

    getTask(): string;
    setTask(value: string): void;

    getApikey(): string;
    setApikey(value: string): void;

    getDtype(): string;
    setDtype(value: string): void;

    getSr(): number;
    setSr(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RequestStream.AsObject;
    static toObject(includeInstance: boolean, msg: RequestStream): RequestStream.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RequestStream, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RequestStream;
    static deserializeBinaryFromReader(message: RequestStream, reader: jspb.BinaryReader): RequestStream;
}

export namespace RequestStream {
    export type AsObject = {
        data: Uint8Array | string,
        task: string,
        apikey: string,
        dtype: string,
        sr: number,
    }
}

export class Response extends jspb.Message { 
    getOutputs(): string;
    setOutputs(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Response.AsObject;
    static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Response;
    static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
    export type AsObject = {
        outputs: string,
    }
}
