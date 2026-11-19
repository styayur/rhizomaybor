import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { ISyntaxRenderOptions } from '../types';
import { default as Renderer } from './index';
export default function backlash(this: Renderer, { h, cursor, block, token, outerClass }: ISyntaxRenderOptions): MuyaSnabbdomVNode[];
