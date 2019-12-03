import { ImageInfoSet } from "./ImageInfoSet";

// base URL
export const URL = "http://localhost:8088";

// ImageInfoSetList
export class ImageInfoSetList {
    // fields
    public imageInfoSetList: Array<ImageInfoSet> = null;

    // constructor
    constructor() {
        this.imageInfoSetList = [];
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
        if (this.isReadyToSend())
            this.postImages();
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
            console.log(data);
            xhr.send(data);
        });
    }
}