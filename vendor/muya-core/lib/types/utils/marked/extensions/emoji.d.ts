interface IEmojiToken {
    type: string;
    raw: string;
    text: string;
    marker: string;
}
interface IOptions {
    isRenderEmoji?: boolean;
}
declare function muyaDefaultExtension (options?: IOptions): {
    extensions: {
        name: string;
        level: "inline";
        start(src: string): number | undefined;
        tokenizer(src: string): {
            type: string;
            raw: string;
            text: string;
            marker: string;
        } | undefined;
        renderer(token: IEmojiToken): string;
    }[];
};
export {};

export default muyaDefaultExtension;
