import { ChannelCredentials, credentials, Metadata } from "grpc";

import { getTimeOut } from "./common";
import {
    API_KEY_METADATA, API_VERSION, API_VERSION_METADATA,
    FORMAT_METADATA, HOST, MAX_DATA_SIZE, SERVER_CA_CERTIFICATE,
    SMART_FILTERING_METADATA, USER_AGENT, USER_AGENT_METADATA,
} from "./constant";
import * as senseclient from "./proto/SenseClient_grpc_pb.js";
import * as proto from "./proto/SenseClient_pb.js";
import { Result } from "./result";

const FILE_FORMAT: string[] = ["wav", "mp3", "ogg", "flac", "mp4"];

/**
 * File is a class that allows to inference audio from a file.
 * A file is any kind of data whose length is known at execution time.
 * (it is opposed to stream whose size is not known at execution time)
 * The server will wait to receive the whole file before starting to inference it
 * @inference
 */
export class File {
    private readonly apiKey: string;
    private readonly format: string;
    private readonly host: string;
    private inferenced: boolean = false;
    private readonly reader: Buffer;
    private readonly smartFiltering: boolean;

    public constructor(host: string, apiKey: string, reader: Buffer, format: string, smartFiltering: boolean) {
        this.host = host;
        this.apiKey = apiKey;
        this.reader = reader;
        this.format = format;
        this.smartFiltering = smartFiltering;
    }

    public async inference(): Promise<Result> {
        if (this.inferenced) {
            throw new Error("file was already inferenced");
        }
        this.inferenced = true;

        return new Promise((resolve: (result: Result) => void, reject: (err: Error) => void): void => {
            const creds: ChannelCredentials = credentials.createSsl(SERVER_CA_CERTIFICATE);
            const client: any = new senseclient.CochlClient(this.host, creds);
            const timeOutMetadata: Metadata = getTimeOut();

            timeOutMetadata.add(API_KEY_METADATA, this.apiKey);
            timeOutMetadata.add(FORMAT_METADATA, this.format);
            timeOutMetadata.add(API_VERSION_METADATA, API_VERSION);
            timeOutMetadata.add(USER_AGENT_METADATA, USER_AGENT);
            if (this.smartFiltering) {
                timeOutMetadata.add(SMART_FILTERING_METADATA, "true");
            }

            const call: any = client.sensefile(timeOutMetadata, (err: any, response: any): any => {
                if (err) {
                    reject(err);

                    return;
                }
                resolve(new Result(response));
            });

            const requests: IterableIterator<any> = this.grpcRequests();
            for (const request of requests) {
                call.write(request);
            }
            call.end();
        });
    }

    private *grpcRequests(): IterableIterator<any> {
        const n: number = this.reader.length;
        let offset: number = 0;
        for (let i: number = 0; i < n; i += MAX_DATA_SIZE) {
            const segment: Buffer = this.reader.slice(i, i + MAX_DATA_SIZE);
            const request: any = new (proto as any).Audio();
            request.setData(segment);
            request.setSegmentoffset(offset);
            request.setSegmentstarttime(0);

            offset += segment.length;
            yield request;
        }

        return;
    }
}

/**
 * FileBuilder is a class that allows to create a File instance
 */
export class FileBuilder {
    /** api key of cochlear.ai projects available at dashboard.cochlear.ai */
    public apiKey?: string;
    /** format of the audio file : can be mp3, flac, wav, ogg, etc... */
    public format?: string;
    /** backend address */
    public host: string;
    /** data reader to the file data */
    public reader?: Buffer;
    /** activate smartfiltering or not */
    public smartFiltering: boolean;

    public constructor() {
        this.host = HOST;
        this.smartFiltering = false;
    }

    public build(): File {
        if (this.apiKey === undefined) {
            throw new Error("api key was not defined");
        }
        if (this.reader === undefined) {
            throw new Error("reader was not defined");
        }
        if (this.format === undefined) {
            throw new Error("format was not defined");
        }

        return new File(this.host, this.apiKey, this.reader, this.format, this.smartFiltering);
    }

    public withAPIKey(key: string): FileBuilder {
        this.apiKey = key;

        return this;
    }

    public withFormat(format: string): FileBuilder {
        this.format = format;

        return this;
    }

    public withHost(host: string): FileBuilder {
        this.host = host;

        return this;
    }

    public withReader(reader: Buffer): FileBuilder {
        this.reader = reader;

        return this;
    }

    public withSmartFiltering(activate: boolean): FileBuilder {
        this.smartFiltering = activate;

        return this;
    }
}
