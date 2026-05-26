import { FileVersionSpec } from "../../interfaces";
import { Cursor } from "../../utils";
export declare function readRleCompressedData(cursor: Cursor, channelCount: number, height: number, fileVersionSpec: FileVersionSpec): {
    red: Uint8Array;
    green: Uint8Array | undefined;
    blue: Uint8Array | undefined;
    alpha: Uint8Array | undefined;
};
//# sourceMappingURL=readRleCompressedData.d.ts.map