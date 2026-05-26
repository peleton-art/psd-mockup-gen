/**
 * Base class for all exceptions thrown by @webtoon/psd
 */
export declare class PsdError extends Error {
    constructor(message?: string);
}
export declare class InvalidBufferLength extends PsdError {
}
export declare class InvalidSignature extends PsdError {
}
export declare class InvalidVersion extends PsdError {
}
export declare class InvalidReservationCode extends PsdError {
}
export declare class InvalidColorMode extends PsdError {
}
export declare class InvalidDepth extends PsdError {
}
export declare class InvalidChannelCount extends PsdError {
}
export declare class InvalidPixelCount extends PsdError {
}
export declare class InvalidChannel extends PsdError {
}
export declare class InvalidBlendingModeSignature extends PsdError {
}
export declare class InvalidGroupDividerType extends PsdError {
}
export declare class UnknownBlendingMode extends PsdError {
}
export declare class InvalidCompression extends PsdError {
}
/**
 * Error thrown when the PSD file uses a compression format that is valid, but
 * currently unsupported by @webtoon/psd
 */
export declare class UnsupportedCompression extends PsdError {
}
export declare class UnsupportedDepth extends PsdError {
}
export declare class UnsupportedChannelKindOffset extends PsdError {
}
export declare class ChannelNotFound extends PsdError {
}
export declare class InvalidClipping extends PsdError {
}
export declare class PanicFrameStackUnmatched extends PsdError {
}
export declare class InvalidOpacityValue extends PsdError {
}
export declare class UnknownEffectsLayerVersion extends PsdError {
}
export declare class InvalidEffectsLayerSignature extends PsdError {
}
export declare class InvalidResourceSignature extends PsdError {
}
export declare class PanicOutOfBoundArray extends PsdError {
}
export declare class InvalidGridAndGuidesVersion extends PsdError {
}
export declare class InvalidGuideDirection extends PsdError {
}
export declare class InvalidSlicesVersion extends PsdError {
}
export declare class InvalidSliceOrigin extends PsdError {
}
export declare class InvalidSlice extends PsdError {
}
/**
 * Error thrown when a value exceeds the limit supported by @webtoon/psd.
 * (This includes negative values that are too small)
 */
export declare class NumberTooLarge extends PsdError {
}
export declare class InvalidAdditionalLayerInfoSignature extends PsdError {
}
export declare class InvalidSectionDividerSetting extends PsdError {
}
export declare class InvalidTypeToolObjectSetting extends PsdError {
}
export declare class InvalidLinkedLayerType extends PsdError {
}
export declare class InvalidDescriptorType extends PsdError {
}
export declare class InvalidDescriptorVersion extends PsdError {
}
export declare class DuplicateDescriptorKey extends PsdError {
}
/** Thrown when a descriptor does not contain the expected key */
export declare class MissingDescriptorKey extends PsdError {
}
/** Thrown when a descriptor value is not of the expected type */
export declare class UnexpectedDescriptorValueType extends PsdError {
}
export declare class InvalidReferenceType extends PsdError {
}
export declare class InvalidUnitFloatType extends PsdError {
}
/** Thrown when lexer fails to parse respective type */
export declare class InvalidEngineDataBoolean extends PsdError {
}
export declare class InvalidEngineDataNumber extends PsdError {
}
/** Thrown when top-level value is not a dict */
export declare class InvalidTopLevelEngineDataValue extends PsdError {
}
export declare class UnexpectedEndOfEngineData extends PsdError {
}
export declare class UnexpectedEngineDataToken extends PsdError {
}
export declare class InvalidEngineDataDictKey extends PsdError {
}
export declare class InvalidEngineDataTextBOM extends PsdError {
}
export declare class MissingEngineDataProperties extends PsdError {
}
//# sourceMappingURL=error.d.ts.map