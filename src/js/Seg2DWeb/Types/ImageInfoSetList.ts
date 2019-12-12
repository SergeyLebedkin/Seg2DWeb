import { ImageInfoSet } from "./ImageInfoSet";
import * as base64js from "base64-js";
import { ImageInfo, ImageType } from "./ImageInfo";

// base URL
export const URL = "http://localhost:8088";

// ImageInfoSetList
export class ImageInfoSetList {
    // fields
    public imageInfoSetList: Array<ImageInfoSet> = null;
    // events
    public onloadFromJson: (this: ImageInfoSetList) => any = null;

    // constructor
    constructor() {
        this.imageInfoSetList = [];
        this.onloadFromJson = null;
    }

    // setImageFilesSE
    public setImageFilesSE(files: Array<File>): void {
        this.imageInfoSetList.length = files.length;
        for (let i = 0; i < files.length; i++) {
            this.imageInfoSetList[i] = new ImageInfoSet();
            this.imageInfoSetList[i].fileSE = files[i];
            this.imageInfoSetList[i].name = files[i].name;
        }
    }

    // setImageFilesBSE
    public setImageFilesBSE(files: Array<File>): void {
        this.imageInfoSetList.length = files.length;
        for (let i = 0; i < files.length; i++) {
            this.imageInfoSetList[i].fileBSE = files[i];
        }
        this.preloadImages();
    }

    // preloadImages
    public preloadImages(): void {
        this.imageInfoSetList.forEach(imageInfoSet => {
            imageInfoSet.onloadImageFiles = this.onloadImageFiles.bind(this);
            imageInfoSet.preloadImages();
        });
    }

    // onloadImageFiles
    private onloadImageFiles(imageInfoSet: ImageInfoSet) {
        if (this.isReadyToSend()) {
            this.postImages().then(value => this.loadFromJson(value));
        }
    }

    // isReadyToSend
    public isReadyToSend(): boolean {
        for (let imageInfoSet of this.imageInfoSetList)
            if (!imageInfoSet.imageInfoSE.loaded || !imageInfoSet.imageInfoBSE.loaded)
                return false;
        return true;
    }

    // postImages
    public postImages(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            let url = URL + "/seg2d";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = event => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let responseData = JSON.parse(xhr.responseText)
                    if (responseData.success)
                        resolve(xhr.responseText)
                    else
                        reject(responseData.Error);
                }
            }
            xhr.onerror = event => {
                console.log("Server Error", xhr.status)
                reject(xhr.status);
            };
            let dataJSON = {
                payload: {
                    images: {}
                }
            };
            this.imageInfoSetList.forEach(imageInfoSet => {
                dataJSON.payload.images[imageInfoSet.name] = {};
                dataJSON.payload.images[imageInfoSet.name]["se" ] = imageInfoSet.imageInfoSE .canvasImage.toDataURL().replace("data:image/png;base64,", "");
                dataJSON.payload.images[imageInfoSet.name]["bse"] = imageInfoSet.imageInfoBSE.canvasImage.toDataURL().replace("data:image/png;base64,", "");
            });
            let data = JSON.stringify(dataJSON);
            xhr.send(data);
        });
    }

    // loadFromJson
    public loadFromJson(value: string) {
        let valueJSON = JSON.parse(value);
        let dims = JSON.parse(valueJSON.dimensions);
        let segs = JSON.parse(valueJSON.segmentations);
        console.log("dims", dims);
        console.log("segs", segs);
        for (let i = 0; i < dims.length; i++) {
            this.imageInfoSetList[i].imageInfoSEG = new ImageInfo();
            this.imageInfoSetList[i].imageInfoSEG.onloadFromBase64 = this.onLoadFromBase64.bind(this);
            this.imageInfoSetList[i].imageInfoSEG.loadImageAsSegmented(dims[i][1], dims[i][0], segs[i]);
            this.imageInfoSetList[i].imageInfoSEG.loaded = true;
            this.imageInfoSetList[i].imageInfoSEG.imageType = ImageType.SEG;
        }
    }

    // onLoadFromBase64
    private onLoadFromBase64(imageInfo: ImageInfo) {
        let loaded: boolean = true;
        for (let imageInfoSet of this.imageInfoSetList)
            if ((imageInfoSet.imageInfoSEG != null) && (!imageInfoSet.imageInfoSEG.loaded))
                loaded = false;
        if (loaded)
            this.onloadFromJson && this.onloadFromJson();
    }
}