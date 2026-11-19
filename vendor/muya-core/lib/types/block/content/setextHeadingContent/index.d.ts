import type { Nullable as MuyaTypeImport0 } from '../../../types';
import type MuyaTypeImport1 from '../../base/parent';
import { Muya } from '../../../muya';
import { ICursor } from '../../../selection/types';
import { default as Format } from '../../base/format';
declare class SetextHeadingContent extends Format {
    static blockName: string;
    static create(muya: Muya, text: string): SetextHeadingContent;
    constructor(muya: Muya, text: string);
    getAnchor(): MuyaTypeImport0<MuyaTypeImport1>;
    update(cursor: ICursor, highlights?: never[]): void;
    enterHandler(event: Event): void;
    backspaceHandler(event: Event): void;
}
export default SetextHeadingContent;
