import * as Tiff from "tiff.js";
import { SelectionInfo } from "./SelectionInfo"
import { SelectionInfoType } from "./SelectionInfoType"
import { SelectionInfoMode } from "./SelectionInfoMode"
import { timingSafeEqual } from "crypto";
import { getOverlayLog } from "../Components/OverlayLog";

export enum ImageType { SE, BSE, SEG };

// ImageInfo
export class ImageInfo {
    // file reference
    public fileRef: File = null;
    public dataFileRef: File = null;
    // name (actully is a file name without ext)
    public name: string = "";
    // flags
    public loaded: boolean = false;
    // canvases
    public canvasImage: HTMLCanvasElement = null;
    public canvasMask: HTMLCanvasElement = null;
    public canvasBorders: HTMLCanvasElement = null;
    // image type
    public imageType: ImageType = ImageType.SE;
    // selection infos
    public selectionInfos: Array<SelectionInfo> = [];
    // image resolution
    public imageResolution: number = 1.0;
    // events
    public onloadImageFile: (this: ImageInfo, imageInfo: ImageInfo) => any = null;
    public onloadImageDataFile: (this: ImageInfo, imageInfo: ImageInfo) => any = null;
    public onloadFromBase64: (this: ImageInfo, imageInfo: ImageInfo) => any = null;
    // constructor
    constructor() {
        // file reference
        this.fileRef = null;
        this.dataFileRef = null;
        // flags
        this.loaded = false;
        // canvases
        this.canvasImage = document.createElement("canvas");
        this.canvasMask = document.createElement("canvas");
        this.canvasBorders = document.createElement("canvas");
        // selections
        this.selectionInfos = [];
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
        this.canvasBorders.width = this.canvasImage.width;
        this.canvasBorders.height = this.canvasImage.height;
        // update data
        this.updateBordersCanvas();
    }

    // addSelectionInfo
    public addSelectionInfo(selectionInfo: SelectionInfo): void {
        // get context
        let canvasMaskCtx = this.canvasMask.getContext("2d") as CanvasRenderingContext2D;
        selectionInfo.drawToContext(canvasMaskCtx);
        // add selection info
        this.selectionInfos.push(selectionInfo);
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

    // loadImageDataFile
    public loadImageFile(file: File): void {
        // store data file ref
        this.loaded = false;
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
        fileReader.onloadend = event => {
            // read tiff data
            let tiff = new Tiff({ buffer: fileReader.result });
            this.copyFromCanvas(tiff.toCanvas());
            this.loaded = true;
            // call event
            getOverlayLog().addMessage(`Image file ${this.fileRef.name} loaded...`);
            this.onloadImageFile && this.onloadImageFile(this);
        }
        fileReader.readAsArrayBuffer(file);
    }

    // loadImageAsSegmented
    public loadImageAsSegmented(width: number, height: number, b64: string): void {
        // create image from base64
        let im = new Image();
        im.onload = event => {
            // decode data
            this.canvasImage.width = im.width;
            this.canvasImage.height = im.height;
            // get context
            let canvasImageCtx = this.canvasImage.getContext("2d") as CanvasRenderingContext2D;
            canvasImageCtx.globalAlpha = 1.0;
            canvasImageCtx.drawImage(im, 0, 0);
            // gte image data
            let canvasImageData = canvasImageCtx.getImageData(0, 0, this.canvasImage.width, this.canvasImage.height);
            // decode image data
            for (let i = 0; i < im.width * im.height; i++) {
                canvasImageData.data[i * 4 + 0] = color_map[canvasImageData.data[i * 4 + 0]][0];
                canvasImageData.data[i * 4 + 1] = color_map[canvasImageData.data[i * 4 + 1]][1];
                canvasImageData.data[i * 4 + 2] = color_map[canvasImageData.data[i * 4 + 2]][2];
                canvasImageData.data[i * 4 + 3] = 255;
            }
            canvasImageCtx.putImageData(canvasImageData, 0, 0);
            this.updateAllCanvases();
            this.loaded = true;
            this.onloadFromBase64 && this.onloadFromBase64(this);
        }
        im.src = "data:image/png;base64," + b64;
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

let color_map = [[0, 0, 0], [0, 255, 0], [127, 127, 127], [255, 255, 255]]; // black, green, gray, white 