import { SamplingFormat } from "../CochlearSense";
import StreamChunkToBuffer from "../StreamChunkToBuffer";

describe("StreamChunkToBuffer", () => {
    test("unready buffers throws", () => {
        const accumulator = new StreamChunkToBuffer(1, SamplingFormat.Int32Bit);
        const uintArray = new Uint8Array([1]);
        accumulator.push(uintArray);
        expect(accumulator.consumeBuffer).toThrow();
    });
    test("new buffer when exactly good number of data", () => {
        const accumulator = new StreamChunkToBuffer(1, SamplingFormat.Int32Bit);
        const uintArray = new Uint8Array([1, 2]);
        accumulator.push(uintArray);
        expect(Array.from(accumulator.consumeBuffer())).toStrictEqual([1, 2]);
    });

    test("new buffer when exactly good number of data", () => {
        const accumulator = new StreamChunkToBuffer(2, SamplingFormat.Int32Bit);
        const firstArray = new Uint8Array([1, 2]);
        const secondArray = new Uint8Array([4, 3]);
        accumulator.push(firstArray);
        accumulator.push(secondArray);
        expect(Array.from(accumulator.consumeBuffer())).toStrictEqual([1, 2, 4, 3]);
    });

    test("new buffer when exactly good number of data", () => {
        const accumulator = new StreamChunkToBuffer(2, SamplingFormat.Int32Bit);
        const array = new Uint8Array([1, 2, 3, 4, 5]);
        accumulator.push(array);
        expect(Array.from(accumulator.consumeBuffer())).toStrictEqual([1, 2, 3, 4]);
    });

    test("new buffer throws when consuming too much", () => {
        const accumulator = new StreamChunkToBuffer(2, SamplingFormat.Int32Bit);
        const array = new Uint8Array([1, 2, 3, 4, 5]);
        accumulator.push(array);
        accumulator.consumeBuffer();
        expect(accumulator.consumeBuffer).toThrow();
    });

    test("new buffer throws when consuming too much", () => {
        const accumulator = new StreamChunkToBuffer(2, SamplingFormat.Int32Bit);
        const array = new Uint8Array([1, 2, 3, 4, 8, 7, 6, 5, 9]);
        accumulator.push(array);
        expect(Array.from(accumulator.consumeBuffer())).toStrictEqual([1, 2, 3, 4]);
        expect(Array.from(accumulator.consumeBuffer())).toStrictEqual([8, 7, 6, 5]);
    });

    test("not ready when initialized", () => {
        const accumulator = new StreamChunkToBuffer(2, SamplingFormat.Int32Bit);
        const array = new Uint8Array([1, 2, 3]);
        accumulator.push(array);
        expect(accumulator.isBufferReady()).toBe(false);
    });
});
