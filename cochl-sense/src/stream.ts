import { AudioBuffer, Segment } from "./buffer";
import { MAX_DATA_SIZE } from "./constant";
import * as proto from "./proto/SenseClient_pb.js";
import { Result } from "./result";

/**
 * Stream is a class that allows to inference audio from a stream.
 * A stream is any kind of audio data whose length is not known at execution time.
 * (it is opposed to file whose size is known at execution time).
 * The server will wait to receive at least 0.5 second of audio before inferencing it.
 */
export class Stream {
    private readonly buffer: AudioBuffer;
    private readonly byteRate: number;
    private readonly call: any;
    private readonly maxEventHistorySize: number;
    private result?: Result;

    public constructor(maxEventHistorySize: number,
                       byteRate: number,
                       buffer: AudioBuffer,
                       call: any,
    ) {
        this.maxEventHistorySize = maxEventHistorySize;
        this.byteRate = byteRate;
        this.buffer = buffer;
        this.call = call;
    }

    public inference(callback: (err?: Error, resp?: Result) => any): void {
        this.call.on("metadata", (metadata: any): void => {
            const windowLengthDuration: number = parseFloat(metadata.get("window_length_second")[0] || "1");
            const windowHopDuration: number = parseFloat(metadata.get("window_hop_second")[0] || "0.5");

            this.buffer.setWindowSize(windowLengthDuration * this.byteRate, windowHopDuration * this.byteRate);
        });

        this.call.on("data", (response: any): void => {
            if (this.result === undefined) {
                this.result = new Result(response);
            } else {
                this.result.appendNewResult(response, this.maxEventHistorySize);
            }
            callback(undefined, this.result);
        });

        this.buffer.onSegment = (segment: Segment): void => {
            for (const s of splitSegment(segment)) {
                const request: any = new (proto as any).Audio();
                request.setData(s.data);
                request.setSegmentoffset(s.offset);
                request.setSegmentstarttime(s.startTime);
                this.call.write(request);
            }
        };

        const closeGrpcConnection: () => void = (): void => { this.call.end(); };
        this.buffer.onClose = closeGrpcConnection;
        this.call.on("close", closeGrpcConnection);
        this.call.on("end", closeGrpcConnection);

        const closeOnError: (err: Error) => void = (err: Error): void => {
            callback(err, undefined);
            closeGrpcConnection();
        };
        this.call.on("error", closeOnError);
        this.buffer.onError = closeOnError;
    }
}

function* splitSegment(segment: Segment): Generator<Segment> {
    let data: Uint8Array = segment.data;
    let offset: number = segment.offset;
    while (data.length > MAX_DATA_SIZE) {
        const chunk: Uint8Array = data.slice(0, MAX_DATA_SIZE);
        data = data.slice(MAX_DATA_SIZE);
        yield {
            data: chunk,
            offset,
            startTime: segment.startTime,
        };
        offset += chunk.length;
    }
    yield {
        data,
        offset,
        startTime: segment.startTime,
    };
}
