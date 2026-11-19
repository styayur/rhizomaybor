import { describe, expect, it } from 'vitest';
import { resolveImageSource } from '../../vendor/muya-core/src/utils/imageSource';

const context = {
  imageRootUrl: 'https://example.org/rhizomaybor/',
  imageDocumentUrl: 'https://example.org/rhizomaybor/writing/building-a-garden/',
};

describe('image source origin and document context', () => {
  it.each([
    ['/garden-assets/leaf.svg', 'https://example.org/rhizomaybor/garden-assets/leaf.svg'],
    ['/rhizomaybor/garden-assets/leaf.svg', 'https://example.org/rhizomaybor/garden-assets/leaf.svg'],
    ['../../garden-assets/leaf.svg?version=1#leaf', 'https://example.org/rhizomaybor/garden-assets/leaf.svg?version=1#leaf'],
    ['./leaf.svg', 'https://example.org/rhizomaybor/writing/building-a-garden/leaf.svg'],
    ['leaf%20mark.svg', 'https://example.org/rhizomaybor/writing/building-a-garden/leaf%20mark.svg'],
    ['https://cdn.example.org/a.png?size=2#image', 'https://cdn.example.org/a.png?size=2#image'],
    ['http://localhost:4173/a.svg', 'http://localhost:4173/a.svg'],
  ])('resolves %s without changing source origin or duplicating the app base', (source, expected) => {
    expect(resolveImageSource(source, context)).toEqual({ src: expected, isUnknownType: false });
  });

  it('also resolves an editor hosted at origin root', () => {
    expect(resolveImageSource('/garden-assets/leaf.svg', { imageRootUrl: 'http://localhost:4173/', imageDocumentUrl: 'http://localhost:4173/writing/a/' }).src)
      .toBe('http://localhost:4173/garden-assets/leaf.svg');
  });

  it('retains image data while rejecting executable data MIME types', () => {
    const source = 'data:image/svg+xml;base64,PHN2Zy8+';
    expect(resolveImageSource(source, context)).toEqual({ src: source, isUnknownType: false });
    expect(resolveImageSource('data:text/html;base64,PHNjcmlwdD4=', context).src).toBe('');
  });

  it('uses MIME detection for HTTP endpoints without a known image extension', () => {
    expect(resolveImageSource('https://images.example.org/render?id=1', context))
      .toEqual({ src: 'https://images.example.org/render?id=1', isUnknownType: true });
  });

  it.each([
    'file:///garden-assets/leaf.svg', 'file:///C:/fixture/private.png',
    'C:/fixture/private.png', 'C:\\fixture\\private.png', '/C:/fixture/private.png',
    '\\\\server\\share\\private.png', '//server/share/private.png',
    'javascript:alert(1)', 'JaVaScRiPt:alert(1)', '%6aavascript%3Aalert(1)',
    'java%0ascript:alert(1)', 'javascript\u0000:alert(1)',
    'data:text/html;base64,PHNjcmlwdD4=', 'data:image/svg+xml,<svg onload=alert(1)>',
    'ftp://example.org/image.png', 'blob:https://example.org/foreign-id',
    'https://name:password@example.org/a.png', 'https://example.org\\@other.example/a.svg',
    '../../../outside.svg', '/../../outside.svg', '%2e%2e/%2e%2e/%2e%2e/outside.svg',
    '/%2fother.example/a.svg', '/%5cother.example/a.svg', '%252fother.example/a.svg',
  ])('never loads filesystem/ambiguous/unsafe source %s', (source) => {
    expect(resolveImageSource(source, context).src).toBe('');
  });

  it('fails closed without a trusted web context or with a cross-origin document', () => {
    expect(resolveImageSource('leaf.svg').src).toBe('');
    expect(resolveImageSource('leaf.svg', { imageRootUrl: 'file:///fixture/' }).src).toBe('');
    expect(resolveImageSource('leaf.svg', { ...context, imageDocumentUrl: 'https://other.example/writing/a/' }).src).toBe('');
    expect(resolveImageSource('leaf.svg', { ...context, imageDocumentUrl: 'https://example.org/outside/' }).src).toBe('');
  });
});
