// SPDX-License-Identifier: MIT
export interface ImageSourceContext {
    imageRootUrl?: string;
    imageDocumentUrl?: string;
}

const DATA_IMAGE = /^data:image\/(?:png|jpeg|gif|webp|avif|bmp|x-icon|vnd\.microsoft\.icon|svg\+xml);base64,[a-z\d+/]+={0,2}$/i;
const CONTROL = /[\u0000-\u001F\u007F]/;

function webUrl(value: string) {
    try {
        const url = new URL(value);
        return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url : null;
    }
    catch {
        return null;
    }
}

// Only display URLs change. The Markdown token/source remains untouched.
// OS drive/UNC/file paths are not web assets and never grant filesystem access.
export function resolveImageSource(source: string, context: ImageSourceContext = {}) {
    const empty = { isUnknownType: false, src: '' };
    const value = source.trim();
    if (!value || CONTROL.test(value))
        return empty;
    if (DATA_IMAGE.test(value))
        return { isUnknownType: false, src: value };
    let decoded: string;
    try {
        decoded = decodeURIComponent(value);
    }
    catch {
        return empty;
    }
    if (CONTROL.test(decoded) || /\\/.test(decoded) || decoded.startsWith('//') || /%2f|%5c/i.test(value) || /%2f|%5c/i.test(decoded))
        return empty;
    let url: URL | null;
    if (/^https?:\/\//i.test(value)) {
        url = webUrl(value);
    }
    else {
        // Reject explicit/encoded schemes, Windows drives and protocol-relative URLs.
        if (/^[^/?#]*:/.test(decoded) || /^\/[a-z]:/i.test(decoded))
            return empty;
        const root = webUrl(context.imageRootUrl ?? '');
        if (!root || root.search || root.hash)
            return empty;
        root.pathname = `${root.pathname.replace(/\/$/, '')}/`;
        const document = webUrl(context.imageDocumentUrl ?? root.href);
        if (!document || document.origin !== root.origin || !document.pathname.startsWith(root.pathname))
            return empty;
        try {
            // Already-prefixed public URLs must not acquire the app base twice.
            url = value.startsWith(root.pathname)
                ? new URL(value, root.origin)
                : value.startsWith('/') ? new URL(value.slice(1), root) : new URL(value, document);
        }
        catch {
            return empty;
        }
        if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname))
            return empty;
    }
    if (!url)
        return empty;
    return { isUnknownType: !/\.(?:jpe?g|png|gif|svg|webp|avif|bmp|ico)$/i.test(url.pathname), src: url.href };
}
