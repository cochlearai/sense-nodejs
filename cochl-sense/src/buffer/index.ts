// tslint:disable:interface-name
export { WindowAlignedBuffer } from "./windowAligned";
export { SimpleBuffer } from "./simple";

import { Readable } from "stream";

import { SimpleBuffer } from "./simple";
import { WindowAlignedBuffer } from "./windowAligned";

export interface DataBuffer {
    pop(): Segment[];
    push(data: Uint8Array): void;
}

export interface Segment {
    /** raw data of a segment */
    data: Uint8Array;
    /** offset in bytes of the data */
    offset: number;
    /** start time of the audio segment */
    startTime: number;
}

/** Bufferize audio localy  */
export class AudioBuffer {
    /** callback when segment is available */
    public onSegment?: (segment: Segment) => void = undefined;
    private buffer?: DataBuffer;
    private readonly initBuffer: SimpleBuffer;

    private readonly streamer: Readable;

    public constructor(streamer: Readable) {
        this.streamer = streamer;
        this.initBuffer = new SimpleBuffer();

        this.streamer.on("data", (chunk: Uint8Array): void => {
            if (this.buffer === undefined) {
                this.initBuffer.push(chunk);

                return;
            }

            this.buffer.push(chunk);
            if (this.onSegment) {
                for (const segment of this.buffer.pop()) {
                    this.onSegment(segment);
                }
            }
        });

        this.streamer.on("close", this.onClose);
        this.streamer.on("end", this.onClose);
        this.streamer.on("error", this.onError);
    }
    /** calback on end of stream */
    public onClose: () => void = () => undefined;
    /** callback on error */
    public onError: (e: any) => void = (_) => undefined;

    public setWindowSize(windowByteLength: number, windowByteHop: number): void {
        if (this.buffer) {
            throw new Error("window size has already been set");
        }
        const segment: Segment[] = this.initBuffer.pop();
        this.buffer = new WindowAlignedBuffer(segment[0].data, windowByteLength, windowByteHop);
    }
}
