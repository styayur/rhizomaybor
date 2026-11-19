import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { ISyntaxRenderOptions, ReferenceDefinitionToken } from '../types';
import { default as Renderer } from './index';
export default function referenceDefinition(this: Renderer, { h, block, token }: ISyntaxRenderOptions & {
    token: ReferenceDefinitionToken;
}): MuyaSnabbdomVNode[];
