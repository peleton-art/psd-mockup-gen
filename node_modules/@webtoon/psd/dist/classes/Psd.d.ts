import { ColorMode, Depth, Guide, ImageData, ParsingResult, ResolutionInfo } from "../interfaces";
import { AdditionalLayerProperties } from "../sections";
import { Layer } from "./Layer";
import { NodeChild } from "./Node";
import { NodeBase } from "./NodeBase";
import { Slice } from "./Slice";
import { Synthesizable } from "./Synthesizable";
/**
 * A parsed PSD file.
 * @alpha
 */
export declare class Psd extends Synthesizable implements NodeBase<never, NodeChild> {
    private parsingResult;
    readonly name = "ROOT";
    readonly type = "Psd";
    readonly opacity = 255;
    readonly composedOpacity = 1;
    readonly parent?: undefined;
    readonly children: NodeChild[];
    readonly layers: Layer[];
    readonly guides: Guide[];
    readonly slices: Slice[];
    readonly icc_profile?: Uint8Array;
    readonly globalLightAngle?: number;
    readonly globalLightAltitude?: number;
    readonly resolutionInfo?: ResolutionInfo;
    readonly additionalLayerProperties: AdditionalLayerProperties;
    static parse(buffer: ArrayBuffer): Psd;
    /** @internal */
    constructor(parsingResult: ParsingResult);
    get width(): number;
    get height(): number;
    get channelCount(): number;
    get depth(): Depth;
    get colorMode(): ColorMode;
    protected get imageData(): ImageData;
    protected buildTreeStructure(): void;
}
//# sourceMappingURL=Psd.d.ts.map