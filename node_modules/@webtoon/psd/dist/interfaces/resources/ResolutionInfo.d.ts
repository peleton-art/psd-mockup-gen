import { ImageResourceBlockBase } from "./ImageResourceBlockBase";
import { ResourceType } from "./ResourceType";
export declare enum ResolutionUnit {
    PixelsPerInch = 1,
    PixelsPerCM = 2
}
export declare enum DimensionUnit {
    Inch = 1,
    CM = 2,
    Point = 3,
    Pica = 4,
    Column = 5
}
export interface ResolutionInfo {
    horizontal: number;
    horizontalUnit: ResolutionUnit;
    widthUnit: DimensionUnit;
    vertical: number;
    verticalUnit: ResolutionUnit;
    heightUnit: DimensionUnit;
}
export declare type ResolutionInfoResourceBlock = ImageResourceBlockBase<ResourceType.ResolutionInfo, ResolutionInfo>;
//# sourceMappingURL=ResolutionInfo.d.ts.map