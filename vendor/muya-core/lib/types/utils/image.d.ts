import { ImageToken } from '../inlineRenderer/types';
import type { ImageSourceContext } from './imageSource';
export interface IImageInfo {
    token: ImageToken;
    imageId: string;
}
export declare function getImageInfo(image: HTMLElement): IImageInfo;
export declare function getImageSrc(src: string, context?: ImageSourceContext): {
    isUnknownType: boolean;
    src: string;
};
export declare function loadImage(url: string, detectContentType?: boolean): Promise<{
    url: string;
    width: number;
    height: number;
}>;
export declare function checkImageContentType(url: string): Promise<boolean>;
export declare function correctImageSrc(src: string): string;
