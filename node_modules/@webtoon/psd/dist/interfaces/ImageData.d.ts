import { ChannelBytes } from "./ChannelBytes";
/**
 * Represents the encoded channel data of the entire PSD file, or an individual
 * layer.
 */
export interface ImageData {
    red: ChannelBytes;
    green?: ChannelBytes;
    blue?: ChannelBytes;
    alpha?: ChannelBytes;
}
//# sourceMappingURL=ImageData.d.ts.map