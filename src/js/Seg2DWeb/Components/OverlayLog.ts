// OverlayLog
export class OverlayLog {
    // parameters
    private parent: HTMLDivElement = null;
    private messages: Array<string> = null;

    // constructor
    constructor(parent: HTMLDivElement) {
        this.parent = parent;
        this.messages = new Array<string>();
    }

    // addMessage
    public addMessage(message: string): void {
        this.messages.push(message);
        this.update();
    }

    // update
    public update(): void {
        this.clear();
        for (let message of this.messages)
            this.parent.innerHTML += `<a style="color: white">${message}</a><br>`;
    }

    // clear
    private clear(): void {
        while (this.parent.firstChild)
            this.parent.removeChild(this.parent.firstChild);
    }

    // show
    public show(): void {
        this.parent.style.display = "block";
    }

    // hide
    public hide(): void {
        this.parent.style.display = "none";
    }
}

// gOverlayLog
export let gOverlayLog: OverlayLog = null;

// initOverlayLog
export function initOverlayLog(parent: HTMLDivElement) {
    gOverlayLog = new OverlayLog(parent);
}

// getOverlayLog
export function getOverlayLog() {
    return gOverlayLog;
}