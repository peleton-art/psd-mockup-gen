import { FileVersionSpec } from "../../interfaces";
import { GroupFrame, LayerFrame } from "./classes";
import { AdditionalLayerProperties } from "./interfaces";
export * from "./classes";
export * from "./interfaces";
export declare type LayerAndMaskInformationSection = {
    layers: LayerFrame[];
    groups: GroupFrame[];
    orders: ("G" | "L" | "D")[];
    globalAdditionalLayerInformation: AdditionalLayerProperties;
};
export declare function parseLayerAndMaskInformation(dataView: DataView, fileVersionSpec: FileVersionSpec): LayerAndMaskInformationSection;
//# sourceMappingURL=index.d.ts.map