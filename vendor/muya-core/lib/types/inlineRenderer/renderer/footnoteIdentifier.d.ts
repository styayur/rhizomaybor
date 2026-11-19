import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { FootnoteIdentifierToken, ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function footnoteIdentifier(this: Renderer, { h, cursor, block, token, outerClass, }: ISyntaxRenderOptions & {
    token: FootnoteIdentifierToken;
}): MuyaSnabbdomVNode[];
