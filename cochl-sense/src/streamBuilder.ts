/*tslint:disable no-magic-numbers*/
import { ChannelCredentials, credentials, Metadata } from "grpc";
import { Readable } from "stream";

import { AudioBuffer } from "./buffer";
import { getTimeOut } from "./common";
import {
    API_KEY_METADATA, API_VERSION, API_VERSION_METADATA,
    FORMAT_METADATA, HOST, MIN_RECOMMANDED_SAMPLING_RATE,
    SERVER_CA_CERTIFICATE, SMART_FILTERING_METADATA, USER_AGENT,
    USER_AGENT_METADATA,
} from "./constant";
import * as senseclient from "./proto/SenseClient_grpc_pb.js";
import { Stream } from "./stream";

export enum Datatype {
    Float32 = "float32",
    Int32 = "int32",
    Int16 = "int16",
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
    /** use smart filtering */
    public smartFiltering: boolean = true;
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

        const buffer: AudioBuffer = new AudioBuffer(this.streamer);

        const audioFormat: string = `PCM(${this.dataType},${this.samplingRate},1)`;

        const creds: ChannelCredentials = credentials.createSsl(SERVER_CA_CERTIFICATE);
        const client: any = new senseclient.CochlClient(this.host, creds);
        const timeOutMetadata: Metadata = getTimeOut();

        timeOutMetadata.add(API_KEY_METADATA, this.apiKey);
        timeOutMetadata.add(FORMAT_METADATA, audioFormat);
        timeOutMetadata.add(API_VERSION_METADATA, API_VERSION);
        timeOutMetadata.add(USER_AGENT_METADATA, USER_AGENT);
        if (this.smartFiltering) {
            timeOutMetadata.add(SMART_FILTERING_METADATA, "true");
        }

        const call: any = client.sensestream(timeOutMetadata);

        const sampleSize: number = dataTypeSize(this.dataType);
        const byteRate: number = sampleSize * this.samplingRate;

        return new Stream(
            this.maxEventHistorySize,
            byteRate,
            buffer,
            call,
        );
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

    public withSmartFiltering(activate: boolean): StreamBuilder {
        this.smartFiltering = activate;

        return this;
    }

    public withStreamer(streamer: Readable): StreamBuilder {
        this.streamer = streamer;

        return this;
    }
}

export function dataTypeSize(dataType: string): number {
    switch (dataType) {
        case Datatype.Float32:
            return 4;
        case Datatype.Int32:
            return 4;
        case Datatype.Int16:
            return 2;
        default:
            throw new Error(`data type '${dataType}' is not supported`);
    }
}
