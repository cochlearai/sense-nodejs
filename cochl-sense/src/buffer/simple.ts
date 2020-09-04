import { Segment } from ".";

/** bufferize simply data used to wait connection to set */
export class SimpleBuffer {
    /** creates new instance */
    public static new(): SimpleBuffer {
        return new SimpleBuffer();
    }
    private buffer: Uint8Array = new Uint8Array();
    private offset: number = 0;

    /** return all data pushed and erase it */
    public pop(): Segment[] {
        const data: Uint8Array = this.buffer;
        const offset: number = this.offset;

        this.buffer = new Uint8Array();
        this.offset = offset + data.length;

        return [{
            data,
            offset,
            startTime: 0,
        }];
    }

    /** add som data on th estack */
    public push(data: Uint8Array): void {
        this.buffer = Buffer.concat([this.buffer, data]);
    }
}
