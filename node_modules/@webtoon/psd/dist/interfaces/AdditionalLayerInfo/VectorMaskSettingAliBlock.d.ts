import { KnownAliBlock } from "./AliBlockBase";
import { AliKey } from "./AliKey";
export declare type Point = {
    vert: number;
    horiz: number;
};
export declare enum PathRecordType {
    ClosedSubpathLength = 0,
    ClosedSubpathBezierKnotLinked = 1,
    ClosedSubpathBezierKnotUnlinked = 2,
    OpenSubpathLength = 3,
    OpenSubpathBezierKnotLinked = 4,
    OpenSubpathBezierKnotUnlinked = 5,
    PathFillRule = 6,
    Clipboard = 7,
    InitialFillRule = 8
}
export declare type PathRecord = {
    type: PathRecordType.ClosedSubpathLength | PathRecordType.OpenSubpathLength;
    length: number;
    operation: number;
    subpathType: number;
    index: number;
} | {
    type: PathRecordType.ClosedSubpathBezierKnotLinked | PathRecordType.ClosedSubpathBezierKnotUnlinked | PathRecordType.OpenSubpathBezierKnotLinked | PathRecordType.OpenSubpathBezierKnotUnlinked;
    preceding: Point;
    anchor: Point;
    leaving: Point;
} | {
    type: PathRecordType.PathFillRule;
} | {
    type: PathRecordType.Clipboard;
    bounds: [number, number, number, number];
    resolution: number;
} | {
    type: PathRecordType.InitialFillRule;
    fill: boolean;
};
export interface VectorMaskSettingAliBlock extends KnownAliBlock<AliKey.VectorMaskSetting1 | AliKey.VectorMaskSetting2> {
    version: number;
    invert: boolean;
    notLink: boolean;
    disable: boolean;
    pathRecords: PathRecord[];
}
//# sourceMappingURL=VectorMaskSettingAliBlock.d.ts.map