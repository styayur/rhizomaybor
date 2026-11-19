import type { Match as MuyaTypeImport0 } from 'execall';
import { IMatch, ISearchOption } from '../search/types';
export declare function matchString(text: string, value: string, options: ISearchOption): MuyaTypeImport0[];
export declare function buildRegexValue(match: IMatch, value: string): string;
