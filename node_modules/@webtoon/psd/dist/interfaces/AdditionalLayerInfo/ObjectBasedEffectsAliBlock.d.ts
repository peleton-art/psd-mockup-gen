import { Descriptor } from "../Descriptor";
import { KnownAliBlock } from "./AliBlockBase";
import { AliKey } from "./AliKey";
export interface ObjectBasedEffectsAliBlock extends KnownAliBlock<AliKey.ObjectBasedEffects> {
    version: number;
    descriptorVersion: number;
    descriptor: Descriptor;
}
//# sourceMappingURL=ObjectBasedEffectsAliBlock.d.ts.map