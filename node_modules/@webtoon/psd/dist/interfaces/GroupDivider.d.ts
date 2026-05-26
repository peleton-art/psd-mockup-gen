/**
 * Enumeration used to mark "divider" layers that group ordinary (non-divider)
 * layers into groups and subgroups.
 */
export declare enum GroupDivider {
    /** 0: any other type of layer */
    Other = 0,
    /** 1: open "folder" */
    OpenFolder = 1,
    /** 2: closed "folder" */
    CloseFolder = 2,
    /**  3: bounding section divider, hidden in the Photoshop UI */
    BoundingSection = 3
}
export declare function matchDividerType(divider: number): GroupDivider;
//# sourceMappingURL=GroupDivider.d.ts.map