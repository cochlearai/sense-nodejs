export enum SamplingFormat {
    Int64Bit,
    Int32Bit,
    Int16Bit,
    Int8Bit,
    Float64Bit,
    Float32Bit,
    Float16Bit,
    Float8Bit,
}

export namespace SamplingFormat {
    export function samplingFormatToByteCount(samplingFormat: SamplingFormat): number {
        switch (samplingFormat) {
            case SamplingFormat.Int8Bit:
            case SamplingFormat.Float8Bit:
                return 1;
            case SamplingFormat.Int16Bit:
            case SamplingFormat.Float16Bit:
                    return 2;
            case SamplingFormat.Int32Bit:
            case SamplingFormat.Float32Bit:
                    return 4;
            case SamplingFormat.Int64Bit:
            case SamplingFormat.Float64Bit:
                    return 8;
            default:
                throw new Error("Sampling format not recognized");
        }
    }

    export function samplingFormatToNumberType(samplingFormat: SamplingFormat): string {
        switch (samplingFormat) {
            case SamplingFormat.Int8Bit:
            case SamplingFormat.Int16Bit:
            case SamplingFormat.Int32Bit:
            case SamplingFormat.Int64Bit:
                    return "int";
            case SamplingFormat.Float8Bit:
            case SamplingFormat.Float16Bit:
            case SamplingFormat.Float32Bit:
            case SamplingFormat.Float64Bit:
                    return "float";
            default:
                throw new Error("Sampling format not recognized");
        }
    }
}
