import { Group } from "./Group";
import { Layer } from "./Layer";
import { Psd } from "./Psd";
export declare type Node = Psd | Group | Layer;
export declare type NodeParent = Psd | Group;
export declare type NodeChild = Group | Layer;
export declare function isNodeParent(node: Node): node is NodeParent;
export declare function isNodeChild(node: Node): node is NodeChild;
export declare function assertIsNodeParent(node: Node): asserts node is NodeParent;
export declare function assertIsNodeChild(node: Node): asserts node is NodeChild;
//# sourceMappingURL=Node.d.ts.map