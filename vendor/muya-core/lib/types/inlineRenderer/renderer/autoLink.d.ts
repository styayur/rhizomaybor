import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { AutoLinkToken, ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function autoLink(this: Renderer, { h, cursor, block, token, outerClass }: ISyntaxRenderOptions & {
    token: AutoLinkToken;
}): MuyaSnabbdomVNode[];
