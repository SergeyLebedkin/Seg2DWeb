import { ImageInfo } from "./Seg2DWeb/Types/ImageInfo";
import { MouseUsageMode } from "./Seg2DWeb/Types/MouseUsageMode";
import { ImageInfoAreasEditor } from "./Seg2DWeb/Components/ImageInfoAreasEditor";

// elements
let buttonScaleUpSE: HTMLButtonElement = null;
let buttonScaleDownSE: HTMLButtonElement = null;
let radioDrawSE: HTMLInputElement = null;
let radioDragSE: HTMLInputElement = null;
let divCanvasPanelSE: HTMLDivElement = null;
let buttonScaleUpBSE: HTMLButtonElement = null;
let buttonScaleDownBSE: HTMLButtonElement = null;
let radioDrawBSE: HTMLInputElement = null;
let radioDragBSE: HTMLInputElement = null;
let divCanvasPanelBSE: HTMLDivElement = null;
let buttonLoadImages: HTMLButtonElement = null;
let buttonPrevImage: HTMLButtonElement = null;
let buttonNextImage: HTMLButtonElement = null;
let buttonSaveImages: HTMLButtonElement = null;
let inputLoadImagesSE: HTMLInputElement = null;
let inputLoadImagesBSE: HTMLInputElement = null;

// globals
let gImageInfoListSE: Array<ImageInfo> = [];
let gImageInfoListBSE: Array<ImageInfo> = [];
let gImageInfoAreasEditorSE: ImageInfoAreasEditor = null;
let gImageInfoAreasEditorBSE: ImageInfoAreasEditor = null;
let gCurrentImageInfoIndex: number = -1;

// loadImagesSE
function loadImagesSE() {
    inputLoadImagesSE.accept = ".tiff,.tif";
    inputLoadImagesSE.onchange = event => {
        for (let file of event.currentTarget["files"]) {
            let imageInfo = new ImageInfo();
            imageInfo.onloadImageFile = imageInfo => {
                // add image info
                gImageInfoListSE.push(imageInfo);
                // show on view
                if (!gImageInfoAreasEditorSE.imageInfo) {
                    gImageInfoAreasEditorSE.setImageInfo(imageInfo);
                    gImageInfoAreasEditorSE.setScale(0.5);
                }
            }
            imageInfo.loadImageFile(file);
        }
    }
    inputLoadImagesSE.click();
}

// loadImagesSE
function loadImagesBSE() {
    inputLoadImagesBSE.accept = ".tiff,.tif";
    inputLoadImagesBSE.onchange = event => {
        for (let file of event.currentTarget["files"]) {
            let imageInfo = new ImageInfo();
            imageInfo.onloadImageFile = imageInfo => {
                // add image info
                gImageInfoListBSE.push(imageInfo);
                // show on view
                if (!gImageInfoAreasEditorBSE.imageInfo) {
                    gImageInfoAreasEditorBSE.setImageInfo(imageInfo);
                    gImageInfoAreasEditorBSE.setScale(0.5);
                }
            }
            imageInfo.loadImageFile(file);
        }
    }
    inputLoadImagesBSE.click();
}

// buttonLoadImagesOnClick
function buttonLoadImagesOnClick(event: MouseEvent) {
    loadImagesSE();
    loadImagesBSE();
}

// buttonSaveImagesOnClick
function buttonSaveImagesOnClick(event: MouseEvent) {
    gImageInfoAreasEditorSE.setImageInfo(null);
}

// buttonScaleUpOnClick
function buttonScaleUpOnClick(event: MouseEvent) {
    let scale = gImageInfoAreasEditorSE.imageScale;
    gImageInfoAreasEditorSE.setScale(scale * 2);
    gImageInfoAreasEditorBSE.setScale(scale * 2);
}

// buttonScaleDownOnClick
function buttonScaleDownOnClick(event: MouseEvent) {
    let scale = gImageInfoAreasEditorSE.imageScale;
    gImageInfoAreasEditorSE.setScale(scale / 2);
    gImageInfoAreasEditorBSE.setScale(scale / 2);
}

// radioDrawOnClick
function radioDrawOnClick(event: MouseEvent) {
    radioDragSE.checked = false;
    radioDragBSE.checked = false;
    radioDrawSE.checked = true;
    radioDrawBSE.checked = true;
    gImageInfoAreasEditorSE.setMouseUsageMode(MouseUsageMode.DRAW);
    gImageInfoAreasEditorBSE.setMouseUsageMode(MouseUsageMode.DRAW);
}

// radioDragOnClick
function radioDragOnClick(event: MouseEvent) {
    radioDragSE.checked = true;
    radioDragBSE.checked = true;
    radioDrawSE.checked = false;
    radioDrawBSE.checked = false;
    gImageInfoAreasEditorSE.setMouseUsageMode(MouseUsageMode.DRAG);
    gImageInfoAreasEditorBSE.setMouseUsageMode(MouseUsageMode.DRAG);
}

// panelOnScroll
function panelOnScroll(event: Event) {
    let element = event.currentTarget as HTMLElement;
    divCanvasPanelSE.scrollLeft = element.scrollLeft;
    divCanvasPanelSE.scrollTop = element.scrollTop;
    divCanvasPanelBSE.scrollLeft = element.scrollLeft;
    divCanvasPanelBSE.scrollTop = element.scrollTop;
    //element.scroll.scrollTop;
}

// buttonPrevImageOnClick
function buttonPrevImageOnClick(event: MouseEvent) {
    console.log("prev");
}

// buttonNextImageOnClick
function buttonNextImageOnClick(event: MouseEvent) {
    console.log("next");
}

// window - onload
window.onload = (event) => {
    // get elements - SE
    buttonScaleUpSE = document.getElementById("buttonScaleUpSE") as HTMLButtonElement;
    buttonScaleDownSE = document.getElementById("buttonScaleDownSE") as HTMLButtonElement;
    radioDrawSE = document.getElementById("radioDrawSE") as HTMLInputElement;
    radioDragSE = document.getElementById("radioDragSE") as HTMLInputElement;
    divCanvasPanelSE = document.getElementById("divCanvasPanelSE") as HTMLDivElement;
    // get elements - BSE
    buttonScaleUpBSE = document.getElementById("buttonScaleUpBSE") as HTMLButtonElement;
    buttonScaleDownBSE = document.getElementById("buttonScaleDownBSE") as HTMLButtonElement;
    radioDrawBSE = document.getElementById("radioDrawBSE") as HTMLInputElement;
    radioDragBSE = document.getElementById("radioDragBSE") as HTMLInputElement;
    divCanvasPanelBSE = document.getElementById("divCanvasPanelBSE") as HTMLDivElement;
    // get elements - controls
    buttonLoadImages = document.getElementById("buttonLoadImages") as HTMLButtonElement;
    buttonSaveImages = document.getElementById("buttonSaveImages") as HTMLButtonElement;
    buttonPrevImage = document.getElementById("buttonPrevImage") as HTMLButtonElement;
    buttonNextImage = document.getElementById("buttonNextImage") as HTMLButtonElement;
    inputLoadImagesSE = document.getElementById("inputLoadImagesSE") as HTMLInputElement;
    inputLoadImagesBSE = document.getElementById("inputLoadImagesBSE") as HTMLInputElement;

    // create and setup image info area aditor
    gImageInfoAreasEditorSE = new ImageInfoAreasEditor(divCanvasPanelSE);
    document.addEventListener("keydown", (event) => gImageInfoAreasEditorSE.onKeyDown(event));
    gImageInfoAreasEditorBSE = new ImageInfoAreasEditor(divCanvasPanelBSE);
    document.addEventListener("keydown", (event) => gImageInfoAreasEditorBSE.onKeyDown(event));

    // add events
    buttonScaleUpSE.onclick = event => buttonScaleUpOnClick(event);
    buttonScaleDownSE.onclick = event => buttonScaleDownOnClick(event);
    radioDragSE.onclick = event => radioDragOnClick(event);
    radioDrawSE.onclick = event => radioDrawOnClick(event);
    divCanvasPanelSE.onscroll = event => panelOnScroll(event);
    buttonScaleUpBSE.onclick = event => buttonScaleUpOnClick(event);
    buttonScaleDownBSE.onclick = event => buttonScaleDownOnClick(event);
    radioDragBSE.onclick = event => radioDragOnClick(event);
    radioDrawBSE.onclick = event => radioDrawOnClick(event);
    divCanvasPanelBSE.onscroll = event => panelOnScroll(event);
    buttonLoadImages.onclick = event => buttonLoadImagesOnClick(event);
    buttonPrevImage.onclick = event => buttonPrevImageOnClick(event);
    buttonNextImage.onclick = event => buttonNextImageOnClick(event);
    buttonSaveImages.onclick = event => buttonSaveImagesOnClick(event);
}