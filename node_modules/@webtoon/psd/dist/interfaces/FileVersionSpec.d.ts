import { PsdVersion } from "../sections";
import { ReadType } from "../utils";
/**
 * Configuration object that describes structural differences (and therefore
 * differences in parsing strategy) between a PSD and PSB file.
 */
export interface FileVersionSpec {
    /**
     * Maximum number of pixels in a single dimension.
     * (i.e. upper limit of image width and height)
     */
    readonly maxPixels: number;
    /**
     * Size of each scanline length field in RLE-encoded image data.
     */
    readonly rleScanlineLengthFieldSize: 2 | 4;
    /**
     * Data type to use when reading a scanline length field in RLE-encoded image
     * data.
     */
    readonly rleScanlineLengthFieldReadType: ReadType;
    readonly layerAndMaskSectionLengthFieldSize: 4 | 8;
    readonly layerInfoSectionLengthFieldSize: 4 | 8;
    /**
     * Data type to use when reading a channel length field in the Layer Record
     * section.
     */
    readonly layerRecordSectionChannelLengthFieldReadType: ReadType;
    /**
     * Whether the Additional Layer Information block's length field size is fixed
     * (4 bytes) or variable (4 or 8 bytes, depending on the key)
     */
    readonly aliLengthFieldSizeIsVariable: boolean;
}
/** Configuration object that describes how to parse a PSD (not PSB) file. */
export declare const PsdSpec: FileVersionSpec;
/** Configuration object that describes how to parse a PSB file. */
export declare const PsbSpec: FileVersionSpec;
export declare function getFileVersionSpec(fileVersion: PsdVersion): FileVersionSpec;
//# sourceMappingURL=FileVersionSpec.d.ts.map