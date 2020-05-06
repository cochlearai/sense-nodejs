/*tslint:disable no-magic-numbers*/
import { ChannelCredentials, credentials, Metadata } from "grpc";
import { Readable } from "stream";

import { getTimeOut } from "./common";
import { API_VERSION, HOST, MAX_DATA_SIZE, SERVER_CA_CERTIFICATE, USER_AGENT } from "./constant";
import * as senseclient from "./proto/SenseClient_grpc_pb.js";
import * as proto from "./proto/SenseClient_pb.js";
import { Result } from "./result";

export const MIN_RECOMMANDED_SAMPLING_RATE: number = 22050;

export enum Datatype {
    Float32 = "float32",
    Int32 = "int32",
    Int16 = "int16",
}

/**
 * Stream is a class that allows to inference audio from a stream.
 * A stream is any kind of audio data whose length is not known at execution time.
 * (it is opposed to file whose size is known at execution time).
 * The server will wait to receive at least 0.5 second of audio before inferencing it.
 */
export class Stream {
    private readonly apiKey: string;
    private buffer: Uint8Array = new Uint8Array();
    private readonly dataType: string;
    private readonly host: string;
    private readonly maxEventHistorySize: number;
    private result?: Result;
    private readonly samplingRate: number;
    private readonly streamer: Readable;

    public constructor(apiKey: string,
                       streamer: Readable,
                       samplingRate: number,
                       dataType: string,
                       host: string,
                       maxEventHistorySize: number,
    ) {
        this.apiKey = apiKey;
        this.streamer = streamer;
        this.samplingRate = samplingRate;
        this.dataType = dataType;
        this.host = host;
        this.maxEventHistorySize = maxEventHistorySize;
    }

    public inference(callback: (err?: Error, resp?: Result) => any): void {
        const creds: ChannelCredentials = credentials.createSsl(SERVER_CA_CERTIFICATE);
        const client: any = new senseclient.SenseClient(this.host, creds);
        const timeOutMetadata: Metadata = getTimeOut();
        const call: any = client.sense_stream(timeOutMetadata);

        call.on("data", (response: any): void => {
            if (this.result === undefined) {
                this.result = new Result(response);
            } else {
                this.result.appendNewResult(response, this.maxEventHistorySize);
            }
            callback(undefined, this.result);
        });

        this.streamer.on("data", (chunk: Uint8Array): void => {
            const requests: any[] = this.newRequests(chunk);
            for (const r of requests) {
                call.write(r);
            }
        });

        const closeGrpcConnection: () => void = (): void => { call.end(); };

        call.on("close", closeGrpcConnection);
        call.on("end", closeGrpcConnection);
        this.streamer.on("close", closeGrpcConnection);
        this.streamer.on("end", closeGrpcConnection);

        const closeOnError: (err: Error) => void = (err: Error): void => {
            callback(err, undefined);
            closeGrpcConnection();
        };

        this.streamer.on("error", closeOnError);
        call.on("error", closeOnError);

    }

    private dataTypeSize(): number {
        switch (this.dataType) {
            case Datatype.Float32:
                return 4;
            case Datatype.Int32:
                return 4;
            case Datatype.Int16:
                return 2;
            default:
                throw new Error(`data type '${ this.dataType }' is not supported`);
        }
    }

    private newRequests(data: Uint8Array): any[] {
        this.buffer = Buffer.concat([this.buffer, data]);
        const result: any[] = [];
        while (this.buffer.length >= this.dataTypeSize() * this.samplingRate / 2) {
            const segment: Uint8Array = this.buffer.slice(0, MAX_DATA_SIZE);
            this.buffer = this.buffer.slice(MAX_DATA_SIZE);
            const request: any = new (proto as any).RequestStream();
            request.setData(segment);
            request.setApikey(this.apiKey);
            request.setDtype(this.dataType);
            request.setSr(this.samplingRate);
            request.setApiVersion(API_VERSION);
            request.setUserAgent(USER_AGENT);
            result.push(request);
        }

        return result;
    }

}

/**
 * StreamBuilder is a class that allows to create a Stream instance
 */
export class StreamBuilder {
    /** api key of cochlear.ai projects available at dashboard.cochlear.ai */
    public apiKey?: string;
    /** type of the pcm stream */
    public dataType?: string;
    /** backend address */
    public host: string = HOST;
    /** max number of events from previous inference to keep in memory */
    public maxEventHistorySize: number = 0;
    /** sampling rate of the pcm stream */
    public samplingRate?: number;
    /** disable sampling rate check */
    public samplingRateWarning: boolean = true;
    /** data of the pcm stream */
    public streamer?: Readable;

    public build(): Stream {
        if (this.apiKey === undefined) {
            throw new Error("api key was not defined");
        }
        if (this.streamer === undefined) {
            throw new Error("streamer was not defined");
        }
        if (this.samplingRate === undefined) {
            throw new Error("sampling rate was not defined");
        }
        if (this.dataType === undefined) {
            throw new Error("data type was not defined");
        }

        return new Stream(this.apiKey,
                          this.streamer,
                          this.samplingRate,
                          this.dataType,
                          this.host,
                          this.maxEventHistorySize);
    }

    public deactivateLowSamplingRateWarning(): StreamBuilder {
        this.samplingRateWarning = false;

        return this;
    }

    public withApiKey(key: string): StreamBuilder {
        this.apiKey = key;

        return this;
    }

    public withDataType(datatype: string): StreamBuilder {
        this.dataType = datatype;

        return this;
    }

    public withHost(host: string): StreamBuilder {
        this.host = host;

        return this;
    }

    public withMaxHistoryEventsSize(size: number): StreamBuilder {
        this.maxEventHistorySize = size;

        return this;
    }

    public withSamplingRate(samplingRate: number): StreamBuilder {
        if (samplingRate < MIN_RECOMMANDED_SAMPLING_RATE && this.samplingRateWarning) {
            throw new Error("a sampling rate of at least 22050 is recommanded");
        }
        this.samplingRate = samplingRate;

        return this;
    }

    public withStreamer(streamer: Readable): StreamBuilder {
        this.streamer = streamer;

        return this;
    }
}
