import { useAppContext } from "@/context/AppContext";
import { Guidance } from "@/types/camera.type";
import { useEffect } from "react";

const useScanner = () => {
    const { canvasRef, isEngineLoaded, textRecWorkerRef, setExText } =
        useAppContext();

    useEffect(() => {
        textRecWorkerRef.current = new window.Worker(
            "/text_rec.worker.bundle.js",
        );

        return () => {
            if (textRecWorkerRef.current) {
                textRecWorkerRef.current.terminate();
            }
        };
    }, []);

    const handleTextDetection = async (): Promise<any[]> => {
        if (!isEngineLoaded || !canvasRef.current || !textRecWorkerRef.current)
            return [];

        return new Promise((resolve) => {
            try {
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = 640;
                tempCanvas.height = 360;
                const tempCtx = tempCanvas.getContext("2d");
                if (tempCtx && canvasRef.current) {
                    tempCtx.drawImage(canvasRef.current, 0, 0, 640, 360);
                }

                const imageDataUrl = tempCanvas.toDataURL("image/jpeg", 0.8);

                const handleMessage = (e: MessageEvent) => {
                    textRecWorkerRef.current!.removeEventListener(
                        "message",
                        handleMessage,
                    );
                    resolve(e.data || []);
                };

                textRecWorkerRef.current!.addEventListener(
                    "message",
                    handleMessage,
                );
                textRecWorkerRef.current!.postMessage(imageDataUrl);
            } catch (error) {
                console.log("failed to trigger worker text detection", error);
                resolve([]);
            }
        });
    };

    const runChecks = async (cv: any, src: any) => {
        const frameArea = src.rows * src.cols;
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        // Brighness check
        const brightness = cv.mean(gray)[0];
        if (brightness < 50) {
            gray.delete();
            setExText([])
            return { pass: false, reason: "dark" as Guidance };
        }

        // Glare check
        const thresh = new cv.Mat();
        cv.threshold(gray, thresh, 240, 255, cv.THRESH_BINARY);
        const glarePixel = cv.countNonZero(thresh);
        thresh.delete();

        if (glarePixel > frameArea * 0.05) {
            gray.delete();
            setExText([])
            return { pass: false, reason: "glare" as Guidance };
        }

        // Blur Check (use variance of Laplacian as sharpness metric)
        const laplacian = new cv.Mat();
        cv.Laplacian(gray, laplacian, cv.CV_64F);

        const mean = new cv.Mat();
        const stddev = new cv.Mat();

        cv.meanStdDev(laplacian, mean, stddev);

        // variance = stddev²
        const variance = Math.pow(stddev.doubleAt(0, 0), 2);

        laplacian.delete();
        mean.delete();
        stddev.delete();

        // console.log(variance)
        if (variance < 65) {
            gray.delete();
            setExText([])
            return { pass: false, reason: "hold_steady" as Guidance };
        }

        const texts = await handleTextDetection();

        gray.delete();

        if (texts.length < 2) {
            console.log("from text_rec");
            setExText([])
            return { pass: false, reason: "no_object" as Guidance };
        }

        const t0 = texts[0].text;
        const t1 = texts[1].text;

        if (
            t0.length > 4 ||
            t1.length > 4 ||
            t0.startsWith("B.No") ||
            t0.startsWith("Batch")
        ) {
            setExText(() => {
                return texts
            });
            return { pass: true, reason: "none" as Guidance };
        }

        return { pass: false, reason: "no_object" as Guidance };
    };

    return { runChecks };
};

export default useScanner;
