import { FileHeaderSection, ImageDataSection, ImageResourcesSection, LayerAndMaskInformationSection } from "../sections";
export interface ParsingResult {
    fileHeader: FileHeaderSection;
    colorModeData: undefined;
    imageResources: ImageResourcesSection;
    layerAndMaskInfo: LayerAndMaskInformationSection;
    imageData: ImageDataSection;
}
//# sourceMappingURL=ParsingResult.d.ts.map