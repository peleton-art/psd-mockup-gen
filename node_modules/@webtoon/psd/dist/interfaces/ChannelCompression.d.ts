export declare enum ChannelCompression {
    /** Uncompressed */
    RawData = 0,
    /** Compressed with [PackBits RLE](https://en.wikipedia.org/wiki/PackBits) */
    RleCompressed = 1,
    /** ZIP compression without prediction */
    ZipWithoutPrediction = 2,
    /** ZIP compression with prediction */
    ZipWithPrediction = 3
}
export declare function matchChannelCompression(compression: number): ChannelCompression;
//# sourceMappingURL=ChannelCompression.d.ts.map