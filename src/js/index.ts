import { ImageInfo } from "./Seg2DWeb/Types/ImageInfo";
import { MouseUsageMode } from "./Seg2DWeb/Types/MouseUsageMode";
import { ImageInfoAreasEditor } from "./Seg2DWeb/Components/ImageInfoAreasEditor";
import { SelectionInfo } from "./Seg2DWeb/Types/SelectionInfo";
import { ImageInfoViewer } from "./Seg2DWeb/Components/ImageInfoViewer";

// elements - SE
let buttonScaleUpSE: HTMLButtonElement = null;
let buttonScaleDownSE: HTMLButtonElement = null;
let radioDrawSE: HTMLInputElement = null;
let radioDragSE: HTMLInputElement = null;
let divCanvasPanelSE: HTMLDivElement = null;
// elements - BSE
let buttonScaleUpBSE: HTMLButtonElement = null;
let buttonScaleDownBSE: HTMLButtonElement = null;
let radioDrawBSE: HTMLInputElement = null;
let radioDragBSE: HTMLInputElement = null;
let divCanvasPanelBSE: HTMLDivElement = null;
// elements - SEG
let buttonScaleUpSEG: HTMLButtonElement = null;
let buttonScaleDownSEG: HTMLButtonElement = null;
let radioDrawSEG: HTMLInputElement = null;
let radioDragSEG: HTMLInputElement = null;
let divCanvasPanelSEG: HTMLDivElement = null;
// elements - general
let buttonLoadImages: HTMLButtonElement = null;
let buttonPrevImage: HTMLButtonElement = null;
let buttonNextImage: HTMLButtonElement = null;
let buttonSaveImages: HTMLButtonElement = null;
let inputLoadImagesSE: HTMLInputElement = null;
let inputLoadImagesBSE: HTMLInputElement = null;
let divInfoViewer: HTMLDivElement = null;

// globals
let gImageInfoListSE: Array<ImageInfo> = [];
let gImageInfoListBSE: Array<ImageInfo> = [];
let gImageInfoAreasEditorSE: ImageInfoAreasEditor = null;
let gImageInfoAreasEditorBSE: ImageInfoAreasEditor = null;
let gImageInfoAreasEditorSEG: ImageInfoAreasEditor = null;
let gImageInfoViewer: ImageInfoViewer = null;
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
                    gCurrentImageInfoIndex = 0;
                    gImageInfoAreasEditorSE.setImageInfo(imageInfo);
                    gImageInfoAreasEditorSEG.setImageInfo(imageInfo);
                    gImageInfoViewer.setImageInfo(imageInfo);
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
                //let seIndex = gImageInfoListSE.findIndex((imageInfo, index) => imageInfo.name.replace("_B", "_S") === imageInfo.name);
                // add image info
                gImageInfoListBSE.push(imageInfo);
                // show on view
                //gImageInfoAreasEditorBSE.setImageInfo(gImageInfoListBSE[gCurrentImageInfoIndex]);                
                if (!gImageInfoAreasEditorBSE.imageInfo) {
                    gImageInfoAreasEditorBSE.setImageInfo(imageInfo);
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
    gImageInfoListSE.forEach((imageInfo, index) => console.log(imageInfo, index));
    gImageInfoListBSE.forEach((imageInfo, index) => console.log(imageInfo, index));
}

// buttonScaleUpOnClick
function buttonScaleUpOnClick(event: MouseEvent) {
    let scale = gImageInfoAreasEditorSE.imageScale;
    gImageInfoAreasEditorSE.setScale(scale * 2);
    gImageInfoAreasEditorBSE.setScale(scale * 2);
    gImageInfoAreasEditorSEG.setScale(scale * 2);
}

// buttonScaleDownOnClick
function buttonScaleDownOnClick(event: MouseEvent) {
    let scale = gImageInfoAreasEditorSE.imageScale;
    gImageInfoAreasEditorSE.setScale(scale / 2);
    gImageInfoAreasEditorBSE.setScale(scale / 2);
    gImageInfoAreasEditorSEG.setScale(scale / 2);
}

// radioDrawOnClick
function radioDrawOnClick(event: MouseEvent) {
    radioDragSE.checked = false;
    radioDragBSE.checked = false;
    radioDragSEG.checked = false;
    radioDrawSE.checked = true;
    radioDrawBSE.checked = true;
    radioDrawSEG.checked = true;
    gImageInfoAreasEditorSE.setMouseUsageMode(MouseUsageMode.DRAW);
    gImageInfoAreasEditorBSE.setMouseUsageMode(MouseUsageMode.DRAW);
    gImageInfoAreasEditorSEG.setMouseUsageMode(MouseUsageMode.DRAW);
}

// radioDragOnClick
function radioDragOnClick(event: MouseEvent) {
    radioDragSE.checked = true;
    radioDragBSE.checked = true;
    radioDragSEG.checked = true;
    radioDrawSE.checked = false;
    radioDrawBSE.checked = false;
    radioDrawSEG.checked = false;
    gImageInfoAreasEditorSE.setMouseUsageMode(MouseUsageMode.DRAG);
    gImageInfoAreasEditorBSE.setMouseUsageMode(MouseUsageMode.DRAG);
    gImageInfoAreasEditorSEG.setMouseUsageMode(MouseUsageMode.DRAG);
}

// panelOnScroll
function panelOnScroll(event: Event) {
    let element = event.currentTarget as HTMLElement;
    divCanvasPanelSE.scrollLeft = element.scrollLeft;
    divCanvasPanelSE.scrollTop = element.scrollTop;
    divCanvasPanelBSE.scrollLeft = element.scrollLeft;
    divCanvasPanelBSE.scrollTop = element.scrollTop;
    divCanvasPanelSEG.scrollLeft = element.scrollLeft;
    divCanvasPanelSEG.scrollTop = element.scrollTop;
    //element.scroll.scrollTop;
}

// buttonPrevImageOnClick
function buttonPrevImageOnClick(event: MouseEvent) {
    gCurrentImageInfoIndex--;
    gCurrentImageInfoIndex = Math.max(gCurrentImageInfoIndex, 0);
    gImageInfoAreasEditorSE.setImageInfo(gImageInfoListSE[gCurrentImageInfoIndex]);
    gImageInfoAreasEditorSEG.setImageInfo(gImageInfoListBSE[gCurrentImageInfoIndex]);
    gImageInfoAreasEditorBSE.setImageInfo(gImageInfoListBSE[gCurrentImageInfoIndex]);
    gImageInfoViewer.setImageInfo(gImageInfoListSE[gCurrentImageInfoIndex]);
}

// buttonNextImageOnClick
function buttonNextImageOnClick(event: MouseEvent) {
    gCurrentImageInfoIndex++;
    gCurrentImageInfoIndex = Math.min(gCurrentImageInfoIndex, gImageInfoListSE.length-1);
    gImageInfoAreasEditorSE.setImageInfo(gImageInfoListSE[gCurrentImageInfoIndex]);
    gImageInfoAreasEditorSEG.setImageInfo(gImageInfoListBSE[gCurrentImageInfoIndex]);
    gImageInfoAreasEditorBSE.setImageInfo(gImageInfoListBSE[gCurrentImageInfoIndex]);
    gImageInfoViewer.setImageInfo(gImageInfoListSE[gCurrentImageInfoIndex]);
}

// onAddSelectionInfoSE
function onAddSelectionInfoSE(selectionInfo: SelectionInfo) {
    if (gImageInfoAreasEditorBSE.imageInfo) {
        gImageInfoAreasEditorBSE.imageInfo.addSelectionInfo(selectionInfo.clone());
        gImageInfoAreasEditorBSE.imageInfo.updateBordersCanvas();
        gImageInfoAreasEditorSE.drawImageInfo();
        gImageInfoAreasEditorBSE.drawImageInfo();
        gImageInfoAreasEditorSEG.drawImageInfo();
    }
}

// onAddSelectionInfoBSE
function onAddSelectionInfoBSE(selectionInfo: SelectionInfo) {
    if (gImageInfoAreasEditorSE.imageInfo) {
        gImageInfoAreasEditorSE.imageInfo.addSelectionInfo(selectionInfo.clone());
        gImageInfoAreasEditorSE.imageInfo.updateBordersCanvas();
        gImageInfoAreasEditorSE.drawImageInfo();
        gImageInfoAreasEditorBSE.drawImageInfo();
        gImageInfoAreasEditorSEG.drawImageInfo();
    }
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
    // get elements - SEG
    buttonScaleUpSEG = document.getElementById("buttonScaleUpSEG") as HTMLButtonElement;
    buttonScaleDownSEG = document.getElementById("buttonScaleDownSEG") as HTMLButtonElement;
    radioDrawSEG = document.getElementById("radioDrawSEG") as HTMLInputElement;
    radioDragSEG = document.getElementById("radioDragSEG") as HTMLInputElement;
    divCanvasPanelSEG = document.getElementById("divCanvasPanelSEG") as HTMLDivElement;
    // get elements - controls
    buttonLoadImages = document.getElementById("buttonLoadImages") as HTMLButtonElement;
    buttonSaveImages = document.getElementById("buttonSaveImages") as HTMLButtonElement;
    buttonPrevImage = document.getElementById("buttonPrevImage") as HTMLButtonElement;
    buttonNextImage = document.getElementById("buttonNextImage") as HTMLButtonElement;
    inputLoadImagesSE = document.getElementById("inputLoadImagesSE") as HTMLInputElement;
    inputLoadImagesBSE = document.getElementById("inputLoadImagesBSE") as HTMLInputElement;
    divInfoViewer = document.getElementById("divInfoViewer") as HTMLDivElement;

    // create and setup image info area aditor
    gImageInfoAreasEditorSE = new ImageInfoAreasEditor(divCanvasPanelSE);
    gImageInfoAreasEditorSE.onAddSelectionInfo = onAddSelectionInfoSE;
    document.addEventListener("keydown", (event) => gImageInfoAreasEditorSE.onKeyDown(event));
    gImageInfoAreasEditorBSE = new ImageInfoAreasEditor(divCanvasPanelBSE);
    gImageInfoAreasEditorBSE.onAddSelectionInfo = onAddSelectionInfoBSE;
    document.addEventListener("keydown", (event) => gImageInfoAreasEditorBSE.onKeyDown(event));
    gImageInfoAreasEditorSEG = new ImageInfoAreasEditor(divCanvasPanelSEG);
    gImageInfoAreasEditorSEG.onAddSelectionInfo = onAddSelectionInfoSE;
    document.addEventListener("keydown", (event) => gImageInfoAreasEditorSEG.onKeyDown(event));

    // create image info viewver 
    gImageInfoViewer = new ImageInfoViewer(divInfoViewer);

    // add events - SE
    buttonScaleUpSE.onclick = event => buttonScaleUpOnClick(event);
    buttonScaleDownSE.onclick = event => buttonScaleDownOnClick(event);
    radioDragSE.onclick = event => radioDragOnClick(event);
    radioDrawSE.onclick = event => radioDrawOnClick(event);
    divCanvasPanelSE.onscroll = event => panelOnScroll(event);
    // add events - BSE
    buttonScaleUpBSE.onclick = event => buttonScaleUpOnClick(event);
    buttonScaleDownBSE.onclick = event => buttonScaleDownOnClick(event);
    radioDragBSE.onclick = event => radioDragOnClick(event);
    radioDrawBSE.onclick = event => radioDrawOnClick(event);
    divCanvasPanelBSE.onscroll = event => panelOnScroll(event);
    // add events - SEG
    buttonScaleUpSEG.onclick = event => buttonScaleUpOnClick(event);
    buttonScaleDownSEG.onclick = event => buttonScaleDownOnClick(event);
    radioDragSEG.onclick = event => radioDragOnClick(event);
    radioDrawSEG.onclick = event => radioDrawOnClick(event);
    divCanvasPanelSEG.onscroll = event => panelOnScroll(event);
    // add events - general
    buttonLoadImages.onclick = event => buttonLoadImagesOnClick(event);
    buttonPrevImage.onclick = event => buttonPrevImageOnClick(event);
    buttonNextImage.onclick = event => buttonNextImageOnClick(event);
    buttonSaveImages.onclick = event => buttonSaveImagesOnClick(event);
}