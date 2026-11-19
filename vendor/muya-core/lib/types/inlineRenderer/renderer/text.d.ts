import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function text(this: Renderer, { h, block, token }: ISyntaxRenderOptions): MuyaSnabbdomVNode[];
