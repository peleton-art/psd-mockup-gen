import { ColorMode, Depth } from "../../interfaces";
export declare enum PsdVersion {
    PSD = 1,
    PSB = 2
}
export declare type FileHeaderSection = {
    version: PsdVersion;
    channelCount: number;
    width: number;
    height: number;
    depth: Depth;
    colorMode: ColorMode;
};
export declare function parseFileHeader(dataView: DataView): FileHeaderSection;
//# sourceMappingURL=index.d.ts.map