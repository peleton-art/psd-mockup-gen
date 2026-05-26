interface BoundingBox {
    top: number;
    left: number;
    bottom: number;
    right: number;
}
export declare function height(boundingBox: BoundingBox): number;
export declare function width(boundingBox: BoundingBox): number;
export declare function dimensions(boundingBox: BoundingBox): {
    height: number;
    width: number;
};
export declare function area(boundingBox: BoundingBox): number;
export {};
//# sourceMappingURL=boundingBox.d.ts.map