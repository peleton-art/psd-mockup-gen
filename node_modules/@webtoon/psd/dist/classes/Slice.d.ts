import { SliceOrigin, SlicesResourceBlock } from "../interfaces";
/**
 * Represents a single slice in a PSD file.
 * @alpha
 */
export declare class Slice {
    origin: SliceOrigin;
    left: number;
    top: number;
    right: number;
    bottom: number;
    constructor(origin: SliceOrigin, left: number, top: number, right: number, bottom: number);
}
export declare function loadSlicesFromResourceBlock(block: SlicesResourceBlock): Slice[];
//# sourceMappingURL=Slice.d.ts.map