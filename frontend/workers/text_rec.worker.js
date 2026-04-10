import Ocr from "@gutenye/ocr-browser";
import * as ort from "onnxruntime-web";

ort.env.wasm.wasmPaths = "/";

// Polyfill document and Image for @gutenye/ocr-browser to run cleanly in Web Worker
if (typeof self.document === "undefined") {
    self.document = {
        createElement: (tag) => {
            if (tag === "canvas") {
                return new OffscreenCanvas(1, 1);
            }
            return {};
        },
        body: { append: () => {} }
    };
}

if (typeof self.Image === "undefined") {
    class WorkerImage {
        constructor() {
            this.src = "";
            this.naturalWidth = 0;
            this.naturalHeight = 0;
            this.width = 0;
            this.height = 0;
            this._bitmap = null;
        }

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

    self.Image = WorkerImage;

    // Proxy drawImage so it extracts the actual ImageBitmap
    const originalDrawImage = self.OffscreenCanvasRenderingContext2D.prototype.drawImage;
    self.OffscreenCanvasRenderingContext2D.prototype.drawImage = function (img, ...args) {
        if (img instanceof WorkerImage && img._bitmap) {
            return originalDrawImage.call(this, img._bitmap, ...args);
        }
        return originalDrawImage.call(this, img, ...args);
    };
}

let ocrInstence = null;

async function getOcr() {
    if (ocrInstence) return ocrInstence;

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

        const result = await ocr.detect(imageDataUrl);
        self.postMessage(result);
    } catch (error) {
        console.log("ocr fail", error);
        self.postMessage([]); // ensure loop resolves on failure
    }
};
