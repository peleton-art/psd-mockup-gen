import { ChannelBytes } from "../interfaces";
/**
 * Decodes one or more encoded channels and combines them into an image.
 * @param width Width of the decoded image in pixels
 * @param height Height of the decoded image in pixels
 * @param red Encoded red channel data
 * @param green Encoded green channel data
 * @param blue Encoded blue channel data
 * @param alpha Encoded alpha channel data
 * @returns `Uint8ClampedArray` containing the pixel data of the decoded image.
 *    Each pixel takes up 4 bytes--1 byte for red, blue, green, and alpha.
 */
export declare function generateRgba(width: number, height: number, red: ChannelBytes, green?: ChannelBytes, blue?: ChannelBytes, alpha?: ChannelBytes): Promise<Uint8ClampedArray>;
export declare function decodeRgb(pixels: number, red: ChannelBytes, green: ChannelBytes, blue: ChannelBytes, alpha?: ChannelBytes): Promise<Uint8Array>;
export declare function decodeGrayscale(pixels: number, color: ChannelBytes, alpha?: ChannelBytes): Promise<Uint8Array>;
//# sourceMappingURL=generateRgba.d.ts.map