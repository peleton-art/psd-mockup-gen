import { EngineData, ImageData } from "../interfaces";
import { LayerFrame, MaskData, LayerProperties } from "../sections";
import { NodeParent } from "./Node";
import { NodeBase } from "./NodeBase";
import { Synthesizable } from "./Synthesizable";
/**
 * A layer in a PSD file.
 * @alpha
 */
export declare class Layer extends Synthesizable implements NodeBase<NodeParent, never> {
    private layerFrame;
    readonly parent: NodeParent;
    readonly type = "Layer";
    readonly children?: undefined;
    /** @internal */
    constructor(layerFrame: LayerFrame, parent: NodeParent);
    get name(): string;
    get width(): number;
    get height(): number;
    get top(): number;
    get left(): number;
    get opacity(): number;
    get composedOpacity(): number;
    get maskData(): MaskData;
    userMask(): Promise<Uint8Array | undefined>;
    realUserMask(): Promise<Uint8Array | undefined>;
    get isHidden(): boolean;
    get isTransparencyLocked(): boolean;
    get additionalProperties(): LayerProperties["additionalLayerProperties"];
    /**
     * If this layer is a text layer, this property retrieves its text content.
     * Otherwise, this property is `undefined`.
     */
    get text(): string | undefined;
    /**
     * If this layer is a text layer, this property retrieves its text properties.
     * Otherwise, this property is `undefined`.
     */
    get textProperties(): EngineData | undefined;
    protected get imageData(): ImageData;
}
//# sourceMappingURL=Layer.d.ts.map