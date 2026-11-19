import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { BeginRuleToken, ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function codeFence(this: Renderer, { h, block, token }: ISyntaxRenderOptions & {
    token: BeginRuleToken;
}): MuyaSnabbdomVNode[];
