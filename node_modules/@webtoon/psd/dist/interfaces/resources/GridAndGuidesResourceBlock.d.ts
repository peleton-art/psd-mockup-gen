import { ImageResourceBlockBase } from "./ImageResourceBlockBase";
import { ResourceType } from "./ResourceType";
export declare type GridAndGuidesResourceBlock = ImageResourceBlockBase<ResourceType.GridAndGuides, {
    version: 1;
    /** 문서별 그리드의 가로 간격 (실제로 쓰이지 않음) */
    gridSizeX: number;
    /** 문서별 그리드의 세로 간격 (실제로 쓰이지 않음) */
    gridSizeY: number;
    guides: Guide[];
}>;
/**
 * Direction of a guide line.
 * @alpha
 */
export declare enum GuideDirection {
    Vertical = 0,
    Horizontal = 1
}
/**
 * A single guide line in a PSD file.
 * @alpha
 */
export interface Guide {
    /**
     * Value in 32ths of a pixel. (example: 800px == 25600)
     */
    position: number;
    direction: GuideDirection;
}
export declare function matchGuideDirection(direction: number): GuideDirection;
//# sourceMappingURL=GridAndGuidesResourceBlock.d.ts.map