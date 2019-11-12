import { ImageInfo } from "../Types/ImageInfo";

export class ImageInfoViewer {
    // parent
    private parent: HTMLDivElement = null;
    public imageInfo: ImageInfo = null;
    constructor(parent: HTMLDivElement) {
        this.parent = parent;
    }

    // setImageInfo
    public setImageInfo(imageInfo: ImageInfo): void {
        if (this.imageInfo != imageInfo) {
            this.imageInfo = imageInfo;
            this.update();
        }
    }

    // update
    public update(): void {
        this.clear();
        // fill parent
        if (this.imageInfo) {
            this.parent.innerHTML = `
                <a>${this.imageInfo.name}</a>
            `;
        }
    }

    // clear
    private clear(): void {
        while (this.parent.firstChild)
            this.parent.removeChild(this.parent.firstChild);
    }
}