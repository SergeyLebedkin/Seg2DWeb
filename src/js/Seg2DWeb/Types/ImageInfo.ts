import * as Tiff from "tiff.js";
import { SelectionInfo } from "./SelectionInfo"
import { SelectionInfoType } from "./SelectionInfoType"
import { SelectionInfoMode } from "./SelectionInfoMode"

export enum ImageType { SE, BSE };

// ImageInfo
export class ImageInfo {
    // file reference
    public fileRef: File = null;
    public dataFileRef: File = null;
    // name (actully is a file name without ext)
    public name: string;
    // canvases
    public canvasImage: HTMLCanvasElement = null;
    public canvasMask: HTMLCanvasElement = null;
    public canvasHiLight: HTMLCanvasElement = null;
    public canvasBorders: HTMLCanvasElement = null;
    public canvasHighResArea: HTMLCanvasElement = null;
    public canvasHighResMask: HTMLCanvasElement = null;
    // image type
    public imageType: ImageType = ImageType.SE;
    // selection infos
    public selectionInfos: Array<SelectionInfo> = [];
    // high resolution image suggestions settings
    public HRWidth: number = 30;
    public HRHeight: number = 23;
    // intensity
    public intensity: Uint32Array = new Uint32Array(256);
    public intensityLow: number = 90;
    public intensityMedium: number = 150;
    public intensityHigh: number = 250;
    // image resolution
    public imageResolution: number = 1.0;
    // events
    public onloadImageFile: (this: ImageInfo, imageInfo: ImageInfo) => any = null;
    public onloadImageDataFile: (this: ImageInfo, imageInfo: ImageInfo) => any = null;

    // constructor
    constructor() {
        // file reference
        this.fileRef = null;
        this.dataFileRef = null;
        // canvases
        this.canvasImage = document.createElement("canvas");
        this.canvasMask = document.createElement("canvas");
        this.canvasHiLight = document.createElement("canvas");
        this.canvasBorders = document.createElement("canvas");
        this.canvasHighResArea = document.createElement("canvas");
        this.canvasHighResMask = document.createElement("canvas");
        // selections
        this.selectionInfos = [];
        // intensity
        this.intensity.fill(0);
        this.intensityLow = 90;
        this.intensityMedium = 150;
        this.intensityHigh = 250;
        // events
        this.onloadImageFile = null;
        this.onloadImageDataFile = null;
    }

    // copyFromCanvas
    public copyFromCanvas(canvas: HTMLCanvasElement): void {
        // set sizes
        this.canvasImage.width = canvas.width;
        this.canvasImage.height = canvas.height;
        // copy data
        let canvasImageCtx = this.canvasImage.getContext("2d");
        canvasImageCtx.drawImage(canvas, 0, 0);
        // update canvases
        this.updateAllCanvases();
    }

    // updateAllCanvases
    private updateAllCanvases(): void {
        // create additional canvases
        this.canvasMask.width = this.canvasImage.width;
        this.canvasMask.height = this.canvasImage.height;
        this.canvasHiLight.width = this.canvasImage.width;
        this.canvasHiLight.height = this.canvasImage.height;
        this.canvasBorders.width = this.canvasImage.width;
        this.canvasBorders.height = this.canvasImage.height;
        this.canvasHighResArea.width = this.canvasImage.width;
        this.canvasHighResArea.height = this.canvasImage.height;
        this.canvasHighResMask.width = this.canvasImage.width;
        this.canvasHighResMask.height = this.canvasImage.height;
        // update data
        this.updateHilightCanvas();
        this.updateBordersCanvas();
        this.updateIntensity();
        this.updateHighResAreaCanvas();
    }

    // addSelectionInfo
    public addSelectionInfo(selectionInfo: SelectionInfo): void {
        // get context
        let canvasMaskCtx = this.canvasMask.getContext("2d") as CanvasRenderingContext2D;
        selectionInfo.drawToContext(canvasMaskCtx);
        // add selection info
        this.selectionInfos.push(selectionInfo);
    }

    // updateHighResAreaCanvas
    public updateHighResAreaCanvas() {
        // get rect doms
        let rectWidth: number = this.HRWidth / (this.imageResolution * 1000);
        let rectHeight: number = this.HRHeight / (this.imageResolution * 1000);

        // get context
        let canvasHighResAreaCtx = this.canvasHighResArea.getContext("2d") as CanvasRenderingContext2D;
        let canvasHighResMaskCtx = this.canvasHighResMask.getContext("2d") as CanvasRenderingContext2D;
        //update high res image data
        canvasHighResAreaCtx.globalAlpha = 0.0;
        canvasHighResAreaCtx.fillStyle = "#00000";
        canvasHighResAreaCtx.strokeStyle = "#00000";
        canvasHighResAreaCtx.clearRect(0, 0, this.canvasHighResArea.width, this.canvasHighResArea.height);
        canvasHighResAreaCtx.globalAlpha = 1.0;
        //update high res image data
        canvasHighResMaskCtx.globalAlpha = 0.0;
        canvasHighResMaskCtx.fillStyle = "#00000";
        canvasHighResMaskCtx.strokeStyle = "#00000";
        canvasHighResMaskCtx.clearRect(0, 0, this.canvasHighResArea.width, this.canvasHighResArea.height);
        canvasHighResMaskCtx.globalAlpha = 1.0;
    }

    // updateHilightCanvas
    public updateHilightCanvas() {
        // get context
        let canvasImageCtx = this.canvasImage.getContext("2d");
        let canvasMaskCtx = this.canvasMask.getContext("2d");
        let canvasHiLightCtx = this.canvasHiLight.getContext("2d");
        // get data arrays
        let canvasImageData = canvasImageCtx.getImageData(0, 0, this.canvasImage.width, this.canvasImage.height);
        let canvasMaskData = canvasMaskCtx.getImageData(0, 0, this.canvasMask.width, this.canvasMask.height);
        let canvasHiLightData = canvasHiLightCtx.getImageData(0, 0, this.canvasHiLight.width, this.canvasHiLight.height);

        // update hi-light image data
        canvasHiLightData.data.fill(0);
        for (let i = 0; i < canvasImageData.data.length; i += 4) {
            if (canvasMaskData.data[i] > 0) {
                if (canvasImageData.data[i] >= this.intensityHigh) {
                    canvasHiLightData.data[i + 0] = 0;
                    canvasHiLightData.data[i + 1] = 255;
                    canvasHiLightData.data[i + 2] = 0;
                    canvasHiLightData.data[i + 3] = 255;
                }
                if (canvasImageData.data[i] <= this.intensityMedium) {
                    canvasHiLightData.data[i + 0] = 0;
                    canvasHiLightData.data[i + 1] = 0;
                    canvasHiLightData.data[i + 2] = 255;
                    canvasHiLightData.data[i + 3] = 255;
                }
                if (canvasImageData.data[i] <= this.intensityLow) {
                    canvasHiLightData.data[i + 0] = 255;
                    canvasHiLightData.data[i + 1] = 0;
                    canvasHiLightData.data[i + 2] = 0;
                    canvasHiLightData.data[i + 3] = 255;
                }
            }
        }

        // store data to canvas
        canvasHiLightCtx.putImageData(canvasHiLightData, 0, 0);
    }

    // updateBordersCanvas
    public updateBordersCanvas() {
        // get context
        let canvasMaskCtx = this.canvasMask.getContext("2d") as CanvasRenderingContext2D;
        let canvasBordersCtx = this.canvasBorders.getContext("2d") as CanvasRenderingContext2D;
        // get data arrays
        let canvasMaskData = canvasMaskCtx.getImageData(0, 0, this.canvasMask.width, this.canvasMask.height);
        let canvasBordersData = canvasBordersCtx.getImageData(0, 0, this.canvasBorders.width, this.canvasBorders.height);

        // update borders data
        canvasBordersData.data.fill(0);
        canvasBordersCtx.putImageData(canvasBordersData, 0, 0);
        for (let i = 0; i < canvasMaskData.data.length - this.canvasMask.width * 4 - 4; i += 4) {
            let x = Math.trunc((i / 4) % this.canvasMask.width);
            let y = Math.trunc((i / 4) / this.canvasMask.width);
            // horizontal border
            if (canvasMaskData.data[i] !== canvasMaskData.data[i + 4]) {
                canvasBordersCtx.fillStyle = "#FF0000";
                canvasBordersCtx.fillRect(x - 2, y - 2, 4, 4);
                canvasBordersCtx.stroke();
            }
            // vertical border
            if (canvasMaskData.data[i] !== canvasMaskData.data[i + this.canvasMask.width * 4]) {
                canvasBordersCtx.fillStyle = "#FF0000";
                canvasBordersCtx.fillRect(x - 2, y - 2, 4, 4);
                canvasBordersCtx.stroke();
            }
        }
    }

    // updateIntensity
    public updateIntensity() {
        // get context
        let canvasImageCtx = this.canvasImage.getContext("2d");
        let canvasMaskCtx = this.canvasMask.getContext("2d");
        // get data arrays
        let canvasImageData = canvasImageCtx.getImageData(0, 0, this.canvasImage.width, this.canvasImage.height);
        let canvasMaskData = canvasMaskCtx.getImageData(0, 0, this.canvasMask.width, this.canvasMask.height);

        // update image data
        this.intensity.fill(0);
        for (let i = 0; i < canvasImageData.data.length; i += 4) {
            if (canvasMaskData.data[i] > 0) {
                this.intensity[canvasImageData.data[i]]++;
            }
        }
    }

    // updateHilightCanvasAndIntensity
    public updateHilightCanvasAndIntensity() {
        // get context
        let canvasImageCtx = this.canvasImage.getContext("2d");
        let canvasMaskCtx = this.canvasMask.getContext("2d");
        let canvasHiLightCtx = this.canvasHiLight.getContext("2d");
        // get data arrays
        let canvasImageData = canvasImageCtx.getImageData(0, 0, this.canvasImage.width, this.canvasImage.height);
        let canvasMaskData = canvasMaskCtx.getImageData(0, 0, this.canvasMask.width, this.canvasMask.height);
        let canvasHiLightData = canvasHiLightCtx.getImageData(0, 0, this.canvasHiLight.width, this.canvasHiLight.height);

        // update hi-light image data
        this.intensity.fill(0);
        canvasHiLightData.data.fill(0);
        for (let i = 0; i < canvasImageData.data.length; i += 4) {
            if (canvasMaskData.data[i] > 0) {
                // update hi-light
                if (canvasImageData.data[i] >= this.intensityHigh) {
                    canvasHiLightData.data[i + 0] = 0;
                    canvasHiLightData.data[i + 1] = 255;
                    canvasHiLightData.data[i + 2] = 0;
                    canvasHiLightData.data[i + 3] = 255;
                }
                if (canvasImageData.data[i] <= this.intensityMedium) {
                    canvasHiLightData.data[i + 0] = 0;
                    canvasHiLightData.data[i + 1] = 0;
                    canvasHiLightData.data[i + 2] = 255;
                    canvasHiLightData.data[i + 3] = 255;
                }
                if (canvasImageData.data[i] <= this.intensityLow) {
                    canvasHiLightData.data[i + 0] = 255;
                    canvasHiLightData.data[i + 1] = 0;
                    canvasHiLightData.data[i + 2] = 0;
                    canvasHiLightData.data[i + 3] = 255;
                }
                // update intensity
                this.intensity[canvasImageData.data[i]]++;
            }
        }

        // store data to canvas
        canvasHiLightCtx.putImageData(canvasHiLightData, 0, 0);
    }

    // getMaskValueByCoord
    public getMaskValueByCoord(x: number, y: number): number {
        let canvasHighResMaskCtx = this.canvasHighResMask.getContext("2d");
        let canvasHighResMaskData = canvasHighResMaskCtx.getImageData(0, 0, this.canvasMask.width, this.canvasMask.height);
        let r = canvasHighResMaskData.data[Math.round(y)*this.canvasHighResMask.width*4 + Math.round(x) * 4 + 0];
        let g = canvasHighResMaskData.data[Math.round(y)*this.canvasHighResMask.width*4 + Math.round(x) * 4 + 1];
        let b = canvasHighResMaskData.data[Math.round(y)*this.canvasHighResMask.width*4 + Math.round(x) * 4 + 2];
        let a = canvasHighResMaskData.data[Math.round(y)*this.canvasHighResMask.width*4 + Math.round(x) * 4 + 3];
        return b;
    }

    // setIntensityLow
    public setIntensityLow(intensityLow: number) {
        this.intensityLow = intensityLow;
    }

    // setIntensityMedium
    public setIntensityMedium(intensityMedium: number) {
        this.intensityMedium = intensityMedium;
    }

    // setIntensityHigh
    public setIntensityHigh(intensityHigh: number) {
        this.intensityHigh = intensityHigh;
    }

    // loadImageDataFile
    public loadImageFile(file: File): void {
        // store data file ref
        this.fileRef = file;
        // extract name from file name
        this.name = this.fileRef.name;
        if (this.name.lastIndexOf(".") >= 0)
            this.name = this.name.split('.').slice(0, -1).join('.');

        // get image type
        if (this.name.lastIndexOf("_S") >= 0)
            this.imageType = ImageType.SE;
        if (this.name.lastIndexOf("_B") >= 0)
            this.imageType = ImageType.BSE;

        // load from file
        let fileReader = new FileReader();
        fileReader.onload = event => {
            // read tiff data
            let tiff = new Tiff({ buffer: fileReader.result });
            this.copyFromCanvas(tiff.toCanvas());
            // call event
            this.onloadImageFile && this.onloadImageFile(this);
        }
        fileReader.readAsArrayBuffer(file);
    }
}

// valueToHex
function valueToHex(value: number): string {
    var hex = Number(value).toString(16);
    return hex.length < 2 ? "0" + hex : hex;
};

// rgbToHexColor
function rgbToHexColor(r: number, g: number, b: number): string {
    var red = valueToHex(r);
    var green = valueToHex(g);
    var blue = valueToHex(b);
    return "#" + red + green + blue;
}