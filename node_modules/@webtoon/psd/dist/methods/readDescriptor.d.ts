import { Descriptor, VersionedDescriptor } from "../interfaces";
import { Cursor } from "../utils";
/**
 * Reads a {@link Descriptor} from the current {@link cursor} position.
 * @param cursor
 */
export declare function readDescriptor(cursor: Cursor): Descriptor;
/**
 * Reads a {@link VersionedDescriptor} from the current {@link cursor} position.
 */
export declare function readVersionedDescriptor(cursor: Cursor): VersionedDescriptor;
//# sourceMappingURL=readDescriptor.d.ts.map