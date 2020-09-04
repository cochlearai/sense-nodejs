import { Segment } from ".";

/** buffer that aligns on the window timing */
export class WindowAlignedBuffer {

    public static new(buffer: Uint8Array, windowByteLength: number, windowByteHop: number): WindowAlignedBuffer {
        return new WindowAlignedBuffer(buffer, windowByteLength, windowByteHop);
    }
    private buffer: Uint8Array;
    private lastIndexSent: number;
    private readonly offset: number;
    private readonly windowHop: number;
    private readonly windowLength: number;

    public constructor(buffer: Uint8Array, windowByteLength: number, windowByteHop: number) {
        this.buffer = buffer;
        this.windowLength = windowByteLength;
        this.windowHop = windowByteHop;
        this.offset = 0;
        this.lastIndexSent = 0;
        this.buffer = new Uint8Array();
    }

    public pop(): Segment[] {
        // Data to pop is all data since last frame until the end of the latest possible window

        const currentIndex: number = this.offset + this.buffer.length;

        const newNumberFramesSent: number = Math.floor((currentIndex - this.windowLength) / this.windowHop);
        const lastNumberFrameSent: number = Math.floor((this.lastIndexSent - this.windowLength) / this.windowHop);

        if (newNumberFramesSent <= lastNumberFrameSent) {
            return [];
        }

        const previousLastIndexSent: number = this.lastIndexSent;
        this.lastIndexSent = newNumberFramesSent * this.windowHop + this.windowLength;

        const segment: Uint8Array = this.buffer.slice(
            previousLastIndexSent - this.offset, this.lastIndexSent - this.offset,
        );

        // Const offset = this.offset
        // This.buffer = this.buffer.slice((this.numberFramesSent + 1) * this.windowHop - this.offset)
        // This.offset = (this.numberFramesSent + 1) * this.windowHop

        return [{
            data: segment,
            offset: previousLastIndexSent,
            startTime: 0,
        }];
    }

    public push(data: Uint8Array): void {
        this.buffer = Buffer.concat([this.buffer, data]);
    }
}
