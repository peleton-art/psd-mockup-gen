import { FileVersionSpec } from "../../interfaces";
import { Cursor } from "../../utils";
import { AdditionalLayerProperties, LayerChannels, LayerRecord } from "./interfaces";
export declare function readLayerRecordsAndChannels(cursor: Cursor, layerCount: number, fileVersionSpec: FileVersionSpec): [LayerRecord, LayerChannels][];
export declare function readGlobalAdditionalLayerInformation(cursor: Cursor, fileVersionSpec: FileVersionSpec): AdditionalLayerProperties;
//# sourceMappingURL=readLayerRecordsAndChannels.d.ts.map