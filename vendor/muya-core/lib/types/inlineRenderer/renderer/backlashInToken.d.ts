import type { VNode as MuyaSnabbdomVNode } from 'snabbdom';
import { H, Token } from '../types';
import { default as Renderer } from './index';
export default function backlashInToken(this: Renderer, h: H, backlashes: string, outerClass: string, start: number, token: Token): MuyaSnabbdomVNode[];
