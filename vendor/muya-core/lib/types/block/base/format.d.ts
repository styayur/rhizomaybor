import type { INodeOffset as MuyaTypeImport0 } from '../../selection/types';
import type { BeginRuleToken as MuyaTypeImport1 } from '../../inlineRenderer/types';
import type { ReferenceDefinitionToken as MuyaTypeImport2 } from '../../inlineRenderer/types';
import type { BacklashToken as MuyaTypeImport3 } from '../../inlineRenderer/types';
import type { StrongEmToken as MuyaTypeImport4 } from '../../inlineRenderer/types';
import type { DelToken as MuyaTypeImport5 } from '../../inlineRenderer/types';
import type { SuperSubScriptToken as MuyaTypeImport6 } from '../../inlineRenderer/types';
import type { FootnoteIdentifierToken as MuyaTypeImport7 } from '../../inlineRenderer/types';
import type { ImageToken as MuyaTypeImport8 } from '../../inlineRenderer/types';
import type { LinkToken as MuyaTypeImport9 } from '../../inlineRenderer/types';
import type { ReferenceLinkToken as MuyaTypeImport10 } from '../../inlineRenderer/types';
import type { ReferenceImageToken as MuyaTypeImport11 } from '../../inlineRenderer/types';
import type { HTMLEscapeToken as MuyaTypeImport12 } from '../../inlineRenderer/types';
import type { AutoLinkExtensionToken as MuyaTypeImport13 } from '../../inlineRenderer/types';
import type { AutoLinkToken as MuyaTypeImport14 } from '../../inlineRenderer/types';
import type { HTMLTagToken as MuyaTypeImport15 } from '../../inlineRenderer/types';
import type { SoftLineBreakToken as MuyaTypeImport16 } from '../../inlineRenderer/types';
import type { HardLineBreakToken as MuyaTypeImport17 } from '../../inlineRenderer/types';
import type { TailHeaderToken as MuyaTypeImport18 } from '../../inlineRenderer/types';
import { CodeEmojiMathToken, TextToken, Token } from '../../inlineRenderer/types';
import { ICursor } from '../../selection/types';
import { IImageInfo } from '../../utils/image';
import { default as Content } from '../../block/base/content';
declare class Format extends Content {
    static blockName: string;
    private _checkCursorInTokenType;
    private _checkNotSameToken;
    checkNeedRender(cursor?: ICursor): boolean;
    blurHandler(): void;
    /**
     * Update emoji text if cursor is in emoji syntax.
     * @param {string} text emoji text
     */
    setEmoji(text: string): void;
    replaceImage({ token }: IImageInfo, { alt, src, title }: {
        alt?: string | undefined;
        src?: string | undefined;
        title?: string | undefined;
    }): void;
    updateImage({ imageId, token }: IImageInfo, attrName: string, attrValue: string): void;
    unlink({ range, text }: {
        range: {
            start: number;
            end: number;
        } | null;
        text: string;
    }): void;
    deleteImage({ token }: IImageInfo): void;
    clickHandler(event: Event): void;
    keyupHandler(): void;
    inputHandler(event: Event): void;
    private _convertIfNeeded;
    private _convertToThematicBreak;
    private _convertToList;
    convertToTaskList(): void;
    private _convertToAtxHeading;
    private _convertToSetextHeading;
    private _convertToBlockQuote;
    private _convertToIndentedCodeBlock;
    convertToParagraph(force?: boolean): void;
    backspaceHandler(event: Event): void;
    deleteHandler(event: KeyboardEvent): void;
    shiftEnterHandler(event: Event): void;
    enterHandler(event: KeyboardEvent): void;
    getFormatsInRange(cursor?: {
        start: {
            offset: number;
        };
        end: {
            offset: number;
        };
        anchor: MuyaTypeImport0;
        focus: MuyaTypeImport0;
        isCollapsed: boolean;
        isSelectionInSameBlock: boolean;
        direction: string;
        type: string;
    } | null): {
        formats: (MuyaTypeImport1 | MuyaTypeImport2 | TextToken | MuyaTypeImport3 | MuyaTypeImport4 | CodeEmojiMathToken | MuyaTypeImport5 | MuyaTypeImport6 | MuyaTypeImport7 | MuyaTypeImport8 | MuyaTypeImport9 | MuyaTypeImport10 | MuyaTypeImport11 | MuyaTypeImport12 | MuyaTypeImport13 | MuyaTypeImport14 | MuyaTypeImport15 | MuyaTypeImport16 | MuyaTypeImport17 | MuyaTypeImport18)[];
        tokens: Token[];
        neighbors: (MuyaTypeImport1 | MuyaTypeImport2 | TextToken | MuyaTypeImport3 | MuyaTypeImport4 | CodeEmojiMathToken | MuyaTypeImport5 | MuyaTypeImport6 | MuyaTypeImport7 | MuyaTypeImport8 | MuyaTypeImport9 | MuyaTypeImport10 | MuyaTypeImport11 | MuyaTypeImport12 | MuyaTypeImport13 | MuyaTypeImport14 | MuyaTypeImport15 | MuyaTypeImport16 | MuyaTypeImport17 | MuyaTypeImport18)[];
    };
    format(type: string): void;
    private _addFormat;
    private _handleClickInlineRuleRender;
    private _emitFootnoteToolEvent;
}
export default Format;
