import { Depth } from "../../interfaces";
import { Cursor } from "../../utils";
export declare function readRawData(cursor: Cursor, depth: Depth, channelCount: number): {
    red: Uint8Array;
    green: Uint8Array | undefined;
    blue: Uint8Array | undefined;
    alpha: Uint8Array | undefined;
};
//# sourceMappingURL=readRawData.d.ts.map