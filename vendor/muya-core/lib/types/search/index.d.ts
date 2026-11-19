import type { Nullable as MuyaTypeImport0 } from '../types';
import type { ScrollPage as MuyaTypeImport1 } from '../block/scrollPage';
import { Muya } from '../muya';
import { IMatch } from './types';
export declare class Search {
    muya: Muya;
    value: string;
    matches: IMatch[];
    index: number;
    get scrollPage(): MuyaTypeImport0<MuyaTypeImport1>;
    constructor(muya: Muya);
    private _updateMatches;
    private _innerReplace;
    replace(replaceValue: string, opt?: {
        isSingle: boolean;
        isRegexp: boolean;
    }): this;
    /**
     * Find preview or next value, and highlight it.
     * @param {string} action : previous or next.
     */
    find(action: 'previous' | 'next'): this;
    /**
     * Search value in current document.
     * @param {string} value
     * @param {object} opts
     */
    search(value: string, opts?: {}): this;
}
