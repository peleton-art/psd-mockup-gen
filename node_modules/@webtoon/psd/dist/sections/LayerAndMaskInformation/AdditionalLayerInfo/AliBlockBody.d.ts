import { AdditionalLayerInfo } from "../../../interfaces";
/**
 * Utility type that should be used by `readX()` functions to return (partial)
 * ALI block objects.
 */
export declare type AliBlockBody<T extends AdditionalLayerInfo> = T extends unknown ? Omit<T, "key" | "signature"> : never;
//# sourceMappingURL=AliBlockBody.d.ts.map