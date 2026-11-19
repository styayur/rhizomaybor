import type { ImageToken } from '../inlineRenderer/types';
import { isWin } from '../config/index';
import { tokenizer } from '../inlineRenderer/lexer';
import { findContentDOM, getOffsetOfParagraph } from '../selection/dom';
import type { ImageSourceContext } from './imageSource';
import { resolveImageSource } from './imageSource';

export interface IImageInfo {
    token: ImageToken;
    imageId: string;
}

export function getImageInfo(image: HTMLElement): IImageInfo {
    const paragraph = findContentDOM(image)!;
    const raw = image.getAttribute('data-raw')!;
    const offset = getOffsetOfParagraph(image, paragraph);
    const tokens = tokenizer(raw);
    const token = tokens[0] as ImageToken;
    token.range = {
        start: offset,
        end: offset + raw.length,
    };

    return {
        token,
        imageId: image.id,
    };
}

export function getImageSrc(src: string, context: ImageSourceContext = {}) {
    return resolveImageSource(src, context);
}

export async function loadImage(url: string, detectContentType = false): Promise<{
    url: string;
    width: number;
    height: number;
}> {
    if (!resolveImageSource(url).src)
        return Promise.reject(new Error('Unsupported image URL'));
    if (detectContentType) {
        const isImage = await checkImageContentType(url);
        if (!isImage)
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject('not an image.');
    }

    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            resolve({
                url,
                width: image.width,
                height: image.height,
            });
        };

        image.onerror = (err) => {
            reject(err);
        };
        image.src = url;
    });
}

export async function checkImageContentType(url: string) {
    try {
        const res = await fetch(url, { method: 'HEAD' });
        const contentType = res.headers.get('content-type');

        if (
            contentType
            && res.status === 200
            && /^image\/(?:jpeg|png|gif|svg\+xml|webp)$/.test(contentType)
        ) {
            return true;
        }

        return false;
    }
    catch {
        return false;
    }
}

export function correctImageSrc(src: string) {
    if (src) {
    // Fix ASCII and UNC paths on Windows (#1997).
        if (isWin && /^(?:[a-z]:\\|[a-z]:\/).+/i.test(src)) {
            src = `file:///${src.replace(/\\/g, '/')}`;
        }
        else if (isWin && /^\\\\\?\\.+/.test(src)) {
            src = `file:///${src.substring(4).replace(/\\/g, '/')}`;
        }
        else if (/^\/.+/.test(src)) {
            // Also adding file protocol on UNIX.
            // Do nothing: src = src
        }
    }

    return src;
}
