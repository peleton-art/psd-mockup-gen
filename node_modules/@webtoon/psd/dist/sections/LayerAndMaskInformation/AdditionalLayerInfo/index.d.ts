import { AdditionalLayerInfo, FileVersionSpec } from "../../../interfaces";
import { Cursor } from "../../../utils";
/**
 * Reads a single Additional Layer Information block from the current
 * {@link cursor} position.
 * @param cursor
 * @param fileVersionSpec
 * @param padding - dictates padding of the blocks. See f4fc9497d2826aeaed17910194dc9e8f7130ebe9
 */
export declare function readAdditionalLayerInfo(cursor: Cursor, fileVersionSpec: FileVersionSpec, padding?: number): AdditionalLayerInfo;
//# sourceMappingURL=index.d.ts.map