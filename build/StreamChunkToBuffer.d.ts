import { SamplingFormat } from "./SamplingFormat";
export default class StreamChunkToBuffer {
    private static readonly SENDING_RATE;
    private readonly bufferSize;
    private buffer;
    private bufferIndex;
    private filledBuffers;
    private samplingFormat;
    constructor(samplingRate: number, samplingFormat: SamplingFormat);
    push(chunk: Uint8Array): void;
    isBufferReady(): boolean;
    consumeBuffer(): Uint8Array;
    getSamplingFormat(): string;
}
