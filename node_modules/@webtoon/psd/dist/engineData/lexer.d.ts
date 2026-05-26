import { Cursor } from "../utils";
export declare enum TokenType {
    String = 0,
    DictBeg = 1,
    DictEnd = 2,
    ArrBeg = 3,
    ArrEnd = 4,
    Name = 5,
    Number = 6,
    Boolean = 7
}
export declare type Token = {
    type: TokenType.String;
    value: string;
} | {
    type: TokenType.DictBeg;
} | {
    type: TokenType.DictEnd;
} | {
    type: TokenType.ArrBeg;
} | {
    type: TokenType.ArrEnd;
} | {
    type: TokenType.Name;
    value: string;
} | {
    type: TokenType.Number;
    value: number;
} | {
    type: TokenType.Boolean;
    value: boolean;
};
export declare class Lexer {
    cursor: Cursor;
    constructor(cursor: Uint8Array);
    tokens(): Token[];
    private done;
    private text;
    private textDecoderFromBOM;
    private string;
    private number;
    private boolean;
}
//# sourceMappingURL=lexer.d.ts.map