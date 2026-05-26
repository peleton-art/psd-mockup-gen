export declare type ReadType = "u8" | "u16" | "u32" | "u64" | "i8" | "i16" | "i32" | "i64" | "f32" | "f64";
/**
 * Decodes a 64-bit region at the given byte offset of the `DataView` as an
 * unsigned 64-bit integer (big endian).
 *
 * If the parsed value is too large to safely fit into a JavaScript `Number`,
 * throws an error.
 * @param data DataView
 * @param byteOffset
 */
export declare function getUint64FromDataView(data: DataView, byteOffset: number): number;
/**
 * Decodes a 64-bit region at the given byte offset of the `DataView` as a
 * signed 64-bit integer (big endian).
 *
 * If the parsed value is too large to safely fit into a JavaScript `Number`,
 * throws an error.
 * @param data DataView
 * @param byteOffset
 */
export declare function getInt64FromDataView(data: DataView, byteOffset: number): number;
/**
 * Utility class that wraps around a `DataView` and tracks the current offset
 * being parsed.
 */
export declare class Cursor {
    private dataView;
    position: number;
    static from(bytes: Uint8Array): Cursor;
    constructor(dataView: DataView, position?: number);
    /**
     * Length of the data covered by this Cursor.
     */
    get length(): number;
    /**
     * Clones the cursor, optionally specifying a new cursor position.
     */
    clone(position?: number): Cursor;
    pass(length: number): void;
    unpass(length: number): void;
    /**
     * Creates a `Uint8Array` that covers the underlying `ArrayBuffer` of this
     * cursor, starting at the current cursor position and spanning a
     * {@link length} number of bytes.
     * This does not advance the cursor.
     */
    extract(length: number): Uint8Array;
    iter(): Uint8Array;
    /**
     * Creates a `Uint8Array` that covers the underlying `ArrayBuffer` of this
     * cursor, starting at the current cursor position and spanning a
     * {@link length} number of bytes.
     * This advances the cursor by `length` bytes.
     */
    take(length: number): Uint8Array;
    /**
     * Returns subsequent byte, without advancing position
     */
    peek(): number;
    /**
     * Returns subsequent byte
     */
    one(): number;
    /**
     * Reads a number at the current cursor position, using the given {@link type}
     * (big endian).
     * This advances the cursor by the size of the data `type`.
     */
    read(type: ReadType): number;
    /**
     * Reads {@link length} bytes of data and decodes it as a UTF-8 string.
     * This advances the cursor by `length` bytes.
     * @param length Length of the data to read in bytes
     * @returns Decoded string
     */
    readString(length: number): string;
    /**
     * Reads the length of the string (u32 field) at the current cursor position,
     * then reads the rest of the string and decodes it as UTF-16BE.
     * This advances the cursor.
     *
     * If {@link padding} is specified, this skips additional bytes until the
     * total number of bytes advanced is a multiple of `padding`
     * @param padding Padding (alignment) byte count
     * @returns Decoded string
     */
    readUnicodeString(padding?: number): string;
    /**
     * Reads unsigned 4-byte fixed-point number.
     * 32 bits in 16.16 setup
     * https://github.com/meltingice/psd.js/blob/333dd1467452a3353018c2856e3e4fb0e07d0025/lib/psd/resources/resolution_info.coffee#L10
     */
    readFixedPoint32bit(): number;
    /**
     * Decodes an "ID string", which is a compact string format used in
     * Descriptors.
     *
     * Reads the length of the string (u32 field) at the current cursor position,
     * then reads the rest of the string and decodes it as UTF-8.
     * If the value of the length field is 0, this always decodes 4 bytes of
     * characters.
     */
    readIdString(): string;
    /**
     * Skips an amount of bytes so that a {@link size}-byte block is aligned to a
     * multiple of {@link divisor}.
     *
     * @example
     * // Skips 5 bytes, which aligns a 75-byte block to a
     * // multiple of 8
     * cursor.padding(75, 8);
     *
     * @param size Value to align against
     * @param divisor Alignment number (can be 0)
     */
    padding(size: number, divisor: number): void;
}
//# sourceMappingURL=bytes.d.ts.map