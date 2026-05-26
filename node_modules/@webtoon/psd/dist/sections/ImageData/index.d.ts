import { ChannelCompression, Depth, FileVersionSpec } from "../../interfaces";
export interface ImageDataSection {
    compression: ChannelCompression;
    red: Uint8Array;
    green?: Uint8Array;
    blue?: Uint8Array;
    alpha?: Uint8Array;
}
export declare function parseImageData(dataView: DataView, depth: Depth, height: number, channelCount: number, fileVersionSpec: FileVersionSpec): ImageDataSection;
//# sourceMappingURL=index.d.ts.map