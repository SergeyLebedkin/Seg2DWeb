import { ImageInfo } from "../Types/ImageInfo";

// ImageInfoViewer
export class ImageInfoViewer {
    // parent
    private parent: HTMLDivElement = null;
    public imageInfo: ImageInfo = null;

    // constructor
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
                <a>Name:${this.imageInfo.name}</a><br>
                <a>Width:${this.imageInfo.canvasImage.width}</a><br>
                <a>Height:${this.imageInfo.canvasImage.height}</a><br>
            `;
        }
    }

    // clear
    private clear(): void {
        while (this.parent.firstChild)
            this.parent.removeChild(this.parent.firstChild);
    }
}