export enum SamplingFormat {
    Int64Bit,
    Int32Bit,
    Int16Bit,
    Int8Bit
}

export namespace SamplingFormat {
    export function samplingFormatToByteCount(samplingFormat: SamplingFormat): number {
        switch(samplingFormat){
            case SamplingFormat.Int8Bit:
                return 1;
            case SamplingFormat.Int16Bit:
                    return 2;
            case SamplingFormat.Int32Bit:
                    return 4;
            case SamplingFormat.Int64Bit:
                    return 8;
            default:
                throw new Error("Sampling format not recognized");
        }
    }

    export function samplingFormatToNumberType(samplingFormat: SamplingFormat): string {
        switch(samplingFormat){
            case SamplingFormat.Int8Bit:
            case SamplingFormat.Int16Bit:
            case SamplingFormat.Int32Bit:
            case SamplingFormat.Int64Bit:
                    return "int";
            default:
                throw new Error("Sampling format not recognized");
        }
    }
}