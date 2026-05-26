import { Token } from "./lexer";
export declare type RawEngineData = {
    [key: string]: RawEngineValue;
};
export declare type RawEngineValue = string | number | boolean | RawEngineValue[] | RawEngineData;
export declare class Parser {
    private tokens;
    private stack;
    constructor(tokens: Iterable<Token>);
    parse(): RawEngineData;
    private runParser;
    private dict;
    private array;
}
//# sourceMappingURL=parser.d.ts.map