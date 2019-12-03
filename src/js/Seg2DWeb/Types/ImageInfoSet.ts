import { ImageInfo } from "./ImageInfo"

// ImageInfoSet
export class ImageInfoSet {
    // fields
    public name: string = "";
    public fileSE: File = null;
    public fileBSE: File = null;
    public imageInfoSE: ImageInfo = null;
    public imageInfoBSE: ImageInfo = null;
    public imageInfoSEG: ImageInfo = null;
    public onloadImageFiles: (this: ImageInfoSet, imageInfoSet: ImageInfoSet) => any = null;
    // constructor
    constructor() {
        this.name = "";
        this.fileSE = null;
        this.fileBSE = null;
        this.imageInfoSE = null;
        this.imageInfoBSE = null;
        this.imageInfoSEG = null;
    }

    // preloadImages
    public preloadImages() {
        if (!this.fileSE) return;
        if (!this.fileBSE) return;
        this.imageInfoSE = new ImageInfo();
        this.imageInfoBSE = new ImageInfo();
        this.imageInfoSE.onloadImageFile = this.onLoadImage.bind(this);
        this.imageInfoBSE.onloadImageFile = this.onLoadImage.bind(this);
        this.imageInfoSE.loadImageFile(this.fileSE);
        this.imageInfoBSE.loadImageFile(this.fileBSE);
        
    }

    // onLoadImage
    private onLoadImage(imageInfo: ImageInfo): void {
        if (this.imageInfoSE.loaded && this.imageInfoBSE.loaded)
            this.onloadImageFiles && this.onloadImageFiles(this);
    }
}