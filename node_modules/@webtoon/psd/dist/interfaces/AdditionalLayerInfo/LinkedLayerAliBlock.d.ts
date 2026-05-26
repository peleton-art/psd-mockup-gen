import { VersionedDescriptor } from "../Descriptor";
import { KnownAliBlock } from "./AliBlockBase";
import { AliKey } from "./AliKey";
export interface LinkedLayerAliBlock extends KnownAliBlock<AliKey.LinkedLayer | AliKey.LinkedLayer2 | AliKey.LinkedLayer3> {
    layers: LinkedLayer[];
}
export interface LinkedLayer {
    layerType: string;
    version: number;
    uniqueId: string;
    filename: string;
    filetype: string;
    creator: string;
    data?: VersionedDescriptor;
    contents: Uint8Array;
    uuid?: string;
}
//# sourceMappingURL=LinkedLayerAliBlock.d.ts.map