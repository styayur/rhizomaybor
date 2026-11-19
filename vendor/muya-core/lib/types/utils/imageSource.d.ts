// SPDX-License-Identifier: MIT
export interface ImageSourceContext {
    imageRootUrl?: string;
    imageDocumentUrl?: string;
}
export declare function resolveImageSource(source: string, context?: ImageSourceContext): {
    isUnknownType: boolean;
    src: string;
};
