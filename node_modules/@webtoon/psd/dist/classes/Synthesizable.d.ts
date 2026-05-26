import { ImageData } from "../interfaces";
export declare abstract class Synthesizable {
    abstract get width(): number;
    abstract get height(): number;
    abstract get opacity(): number;
    abstract get composedOpacity(): number;
    protected abstract get imageData(): ImageData;
    composite(effect?: boolean, composed?: boolean): Promise<Uint8ClampedArray>;
}
//# sourceMappingURL=Synthesizable.d.ts.map