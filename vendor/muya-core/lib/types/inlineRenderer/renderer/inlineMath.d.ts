import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { CodeEmojiMathToken, ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function inlineMath(this: Renderer, { h, cursor, block, token, outerClass, }: ISyntaxRenderOptions & {
    token: CodeEmojiMathToken;
}): MuyaSnabbdomVNode[];
