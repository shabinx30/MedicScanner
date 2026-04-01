// text_rec.worker.ts

// 1. Polyfill document and Image for @gutenye/ocr-browser to run cleanly in Web Worker
if (typeof (self as any).document === "undefined") {
    (self as any).document = {
        createElement: (tag: string) => {
            if (tag === "canvas") {
                return new OffscreenCanvas(1, 1);
            }
            return {};
        },
        body: { append: () => {} }
    };
}

if (typeof (self as any).Image === "undefined") {
    class WorkerImage {
        src: string = "";
        naturalWidth: number = 0;
        naturalHeight: number = 0;
        width: number = 0;
        height: number = 0;
        _bitmap: ImageBitmap | null = null;

        async decode() {
            if (!this.src) return;
            const res = await fetch(this.src);
            const blob = await res.blob();
            this._bitmap = await createImageBitmap(blob);
            this.naturalWidth = this._bitmap.width;
            this.naturalHeight = this._bitmap.height;
            this.width = this.naturalWidth;
            this.height = this.naturalHeight;
        }
    }

    (self as any).Image = WorkerImage;

    // Proxy drawImage so it extracts the actual ImageBitmap
    const originalDrawImage = (self as any).OffscreenCanvasRenderingContext2D.prototype.drawImage;
    (self as any).OffscreenCanvasRenderingContext2D.prototype.drawImage = function (img: any, ...args: any[]) {
        if (img instanceof WorkerImage && img._bitmap) {
            return originalDrawImage.call(this, img._bitmap, ...args);
        }
        return originalDrawImage.call(this, img, ...args);
    };
}

let ocrInstence: any = null;

async function getOcr() {
    if (ocrInstence) return ocrInstence;

    const Ocr = (await import("@gutenye/ocr-browser")).default;

    ocrInstence = await Ocr.create({
        models: {
            detectionPath: "/model/ch_PP-OCRv4_det_infer.onnx",
            recognitionPath: "/model/ch_PP-OCRv4_rec_infer.onnx",
            dictionaryPath: "/model/ppocr_keys_v1.txt",
        },
    });

    return ocrInstence;
}

self.onmessage = async (e) => {
    const imageDataUrl = e.data;
    try {
        const ocr = await getOcr();
        console.log("ocr is ready");

        console.log("Starting Web Worker OCR detection...");
        const result = await ocr.detect(imageDataUrl); 
        console.log("Worker Detection finished.");
        self.postMessage(result);
    } catch (error) {
        console.log("ocr fail", error);
        self.postMessage([]); // ensure loop resolves on failure
    }
};
