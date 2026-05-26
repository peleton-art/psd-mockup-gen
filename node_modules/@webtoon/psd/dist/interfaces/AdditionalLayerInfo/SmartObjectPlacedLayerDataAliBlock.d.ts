import { VersionedDescriptor } from "../Descriptor";
import { KnownAliBlock } from "./AliBlockBase";
import { AliKey } from "./AliKey";
export interface SmartObjectPlacedLayerDataAliBlock extends KnownAliBlock<AliKey.SmartObjectPlacedLayerData | AliKey.PlacedLayerData> {
    identifier: string;
    version: number;
    data: VersionedDescriptor;
}
//# sourceMappingURL=SmartObjectPlacedLayerDataAliBlock.d.ts.map