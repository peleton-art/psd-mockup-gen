import { ChannelBytes } from "../../interfaces";
import { LayerRecord, LayerChannels, LayerProperties } from "./interfaces";
export declare class LayerFrame {
    readonly channels: LayerChannels;
    readonly layerProperties: LayerProperties;
    static create(layerRecord: LayerRecord, channels: LayerChannels, groupId?: number): LayerFrame;
    constructor(channels: LayerChannels, layerProperties: LayerProperties);
    get red(): ChannelBytes;
    get green(): ChannelBytes | undefined;
    get blue(): ChannelBytes | undefined;
    get alpha(): ChannelBytes | undefined;
    get userMask(): ChannelBytes | undefined;
    get realUserMask(): ChannelBytes | undefined;
    get width(): number;
    get height(): number;
}
export declare class GroupFrame {
    readonly id: number;
    readonly layerProperties: LayerProperties;
    static create(name: string, id: number, layerRecord: LayerRecord, groupId?: number): GroupFrame;
    constructor(id: number, layerProperties: LayerProperties);
}
//# sourceMappingURL=classes.d.ts.map