import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { DelToken, ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function del(this: Renderer, { h, cursor, block, token, outerClass }: ISyntaxRenderOptions & {
    token: DelToken;
}): MuyaSnabbdomVNode[];
