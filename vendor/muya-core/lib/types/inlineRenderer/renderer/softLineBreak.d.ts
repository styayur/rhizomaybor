import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { ISyntaxRenderOptions, SoftLineBreakToken } from '../types';
import { default as Renderer } from './index';
export default function softLineBreak(this: Renderer, { h, token }: ISyntaxRenderOptions & {
    token: SoftLineBreakToken;
}): MuyaSnabbdomVNode[];
