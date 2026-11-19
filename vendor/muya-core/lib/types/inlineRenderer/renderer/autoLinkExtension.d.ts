import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { AutoLinkExtensionToken, ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function autoLinkExtension(this: Renderer, { h, block, token }: ISyntaxRenderOptions & {
    token: AutoLinkExtensionToken;
}): MuyaSnabbdomVNode[];
