import { SamplingFormat } from "./SamplingFormat";

export default class StreamChunkToBuffer {
    private readonly bufferSize : number
    private static readonly SENDING_RATE = 2 //Buffer will be 1/SENDING_RATE seconds long
    private buffer: Uint8Array
    private bufferIndex = 0;

    private filledBuffers: Uint8Array[] = []
    private samplingFormat: SamplingFormat

    constructor(samplingRate: number, samplingFormat: SamplingFormat){
        // Sending every 0.5 second (Rate / 2) a 32bit information: 4 Bytes
        const samplingSize = SamplingFormat.samplingFormatToByteCount(samplingFormat);
        this.bufferSize = samplingRate * samplingSize / StreamChunkToBuffer.SENDING_RATE;
        this.buffer = new Uint8Array(this.bufferSize)
        this.samplingFormat = samplingFormat;
    }

    push(chunk: Uint8Array) {
        let chunkIndex = 0;
        while(chunkIndex < chunk.length){
            const sizeToCopy = Math.min(this.bufferSize - this.bufferIndex, chunk.length - chunkIndex)
            this.buffer.set(chunk.slice(chunkIndex, chunkIndex + sizeToCopy), this.bufferIndex);
            chunkIndex += sizeToCopy;
            this.bufferIndex += sizeToCopy;

            if(this.bufferIndex === this.bufferSize){
                this.filledBuffers.push(this.buffer);
                this.buffer = new Uint8Array(this.bufferSize);
                this.bufferIndex = 0;
            }
        }
    }

    isBufferReady(): boolean {
        return this.filledBuffers.length > 0;
    }

    consumeBuffer(): Uint8Array {
        if(!this.isBufferReady()){
            throw new Error("Cannot send a partial buffer.");
        }
        return this.filledBuffers.shift();
    }

    getSamplingFormat(): string {
        return SamplingFormat.samplingFormatToNumberType(this.samplingFormat) +
        (8*SamplingFormat.samplingFormatToByteCount(this.samplingFormat));
    }
}