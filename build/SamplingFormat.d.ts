export declare enum SamplingFormat {
    Int64Bit = 0,
    Int32Bit = 1,
    Int16Bit = 2,
    Int8Bit = 3,
    Float64Bit = 4,
    Float32Bit = 5,
    Float16Bit = 6,
    Float8Bit = 7
}
export declare namespace SamplingFormat {
    function samplingFormatToByteCount(samplingFormat: SamplingFormat): number;
    function samplingFormatToNumberType(samplingFormat: SamplingFormat): string;
}
