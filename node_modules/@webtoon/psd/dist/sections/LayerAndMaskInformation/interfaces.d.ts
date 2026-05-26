import { AdditionalLayerInfo, BlendMode, ChannelBytes, ChannelKind, Clipping, EngineData, GroupDivider } from "../../interfaces";
export interface LayerRecord {
    name: string;
    channelInformation: [ChannelKind, number][];
    top: number;
    left: number;
    bottom: number;
    right: number;
    hidden: boolean;
    transparencyLocked: boolean;
    opacity: number;
    clipping: Clipping;
    blendMode: BlendMode;
    additionalLayerInfos: AdditionalLayerInfo[];
    /** If defined, divider type for "group divider" layers. */
    dividerType?: GroupDivider;
    /** If defined, contains the text of a Text Layer. */
    layerText?: string;
    /** If defined, containts extra text properties */
    engineData?: EngineData;
    maskData: MaskData;
}
export declare type LayerChannels = Map<ChannelKind, ChannelBytes>;
export interface Frame {
    startIndex: number;
    groupId: number;
    parentGroupId: number;
    layerRecord?: LayerRecord;
}
export declare type AdditionalLayerProperties = AdditionalLayerInfo[];
export interface LayerProperties {
    name: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
    hidden: boolean;
    transparencyLocked: boolean;
    opacity: number;
    clippingMask: Clipping;
    blendMode: BlendMode;
    groupId?: number;
    /** Text content of text layers */
    text?: string;
    /** Text properties */
    textProperties?: EngineData;
    maskData: MaskData;
    additionalLayerProperties: AdditionalLayerProperties;
}
export declare const createLayerProperties: (name: string, layerRecord: LayerRecord, groupId?: number) => LayerProperties;
export interface MaskFlags {
    positionRelativeToLayer: boolean;
    layerMaskDisabled: boolean;
    invertMaskWhenBlending: boolean;
    userMaskFromRenderingOtherData: boolean;
    masksHaveParametersApplied: boolean;
}
export interface MaskParameters {
    userMaskDensity?: number;
    userMaskFeather?: number;
    vectorMaskDensity?: number;
    vectorMaskFeather?: number;
}
export interface RealMaskData {
    flags: MaskFlags;
    backgroundColor: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
}
export interface MaskData {
    top: number;
    left: number;
    bottom: number;
    right: number;
    backgroundColor: number;
    flags: MaskFlags;
    parameters?: MaskParameters;
    realData?: RealMaskData;
}
//# sourceMappingURL=interfaces.d.ts.map