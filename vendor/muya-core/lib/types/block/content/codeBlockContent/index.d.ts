import type { Nullable as MuyaTypeImport0 } from '../../../types';
import type MuyaTypeImport1 from '../../commonMark/codeBlock';
import type MuyaTypeImport2 from '../../base/parent';
import { Muya } from '../../../muya';
import { ICursor } from '../../../selection/types';
import { CodeContentState } from '../../../state/types';
import { default as Code } from '../../commonMark/codeBlock/code';
import { default as Content } from '../../base/content';
declare class CodeBlockContent extends Content {
    initialLang: string;
    parent: Code | null;
    static blockName: string;
    static create(muya: Muya, state: CodeContentState): CodeBlockContent;
    get lang(): string;
    /**
     * Always be the `pre` element
     */
    get codeContainer(): MuyaTypeImport0<MuyaTypeImport1>;
    get outContainer(): void | MuyaTypeImport2 | null;
    constructor(muya: Muya, state: CodeContentState);
    getAnchor(): void | MuyaTypeImport2 | null;
    updatePreviewIfHave(text: string): void;
    update(_cursor: ICursor, highlights?: never[]): void;
    private _lastLineCount;
    private _updateLineNumbers;
    inputHandler(event: Event): void;
    enterHandler(event: KeyboardEvent): void;
    tabHandler(event: KeyboardEvent): void;
    backspaceHandler(event: KeyboardEvent): void;
    keyupHandler(): void;
}
export default CodeBlockContent;
