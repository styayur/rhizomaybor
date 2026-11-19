import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { HardLineBreakToken, ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function hardLineBreak(this: Renderer, { h, token }: ISyntaxRenderOptions & {
    token: HardLineBreakToken;
}): MuyaSnabbdomVNode[];
