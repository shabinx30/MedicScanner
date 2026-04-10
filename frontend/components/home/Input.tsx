"use client";

import { useAppContext } from "@/context/AppContext";
import { showError } from "@/libs/error";
import useScanner from "@/libs/Scanner";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { IoCloudUploadOutline } from "react-icons/io5";

const Input = () => {
    const { canvasRef, isEngineLoaded, setEnginLoaded, setImages, setError } =
        useAppContext();
    const { runChecks } = useScanner();
    const router = useRouter();

    const handleUploadImage = async () => {
        const cv = (window as any).cv;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });
        const targetHeight = 640;

        const pickerOptions = {
            types: [
                {
                    description: "Images",
                    accept: {
                        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
                    },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: true,
        };

        try {
            const fileHandle = await (window as any).showOpenFilePicker(
                pickerOptions,
            );

            if (fileHandle.length > 4) {
                showError("Only upto 4 image supported", setError);
                return;
            }

            for (const handle of fileHandle) {
                const file = await handle.getFile();
                const imageBitmap = await createImageBitmap(file);

                const aspectRatio = imageBitmap.width / imageBitmap.height;

                const targetWidth = targetHeight * aspectRatio;

                if (canvas && ctx) {
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = "high";

                    ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);
                    const src = cv.imread(canvas);
                    const result = await runChecks(cv, src);
                    if (!result.pass) {
                        let reason;
                        if (result.reason === "dark") {
                            reason = "it's too dark";
                        } else if (result.reason === "glare") {
                            reason = "it contains too much glare";
                        } else if (result.reason === "hold_steady") {
                            reason = "the image got blurred";
                        } else {
                            reason = "we couldn't find the medicine";
                        }

                        showError(`Try to upload a better image, ${reason}`, setError)
                        imageBitmap.close();
                        return;
                    }

                    const dataUrl = canvas.toDataURL("image/jpeg");
                    setImages((p) => [...p, dataUrl]);
                }

                imageBitmap.close();
            }
            router.push("/result?source=images");
        } catch (error) {
            console.log(error);
            return;
        }
    };

    return (
        <>
            <Script
                src="/opencv.js"
                strategy="lazyOnload"
                onLoad={() => {
                    const cv = (window as any).cv;
                    if (cv && typeof cv.Mat === "function") {
                        setEnginLoaded(true);
                    } else if (cv) {
                        cv["onRuntimeInitialized"] = () => {
                            setEnginLoaded(true);
                        };
                    }
                }}
            />
            <div
                onClick={() => {
                    if (isEngineLoaded) {
                        handleUploadImage();
                    }
                }}
                className={`mt-2 ${isEngineLoaded ? "bg-[#c2fcff] hover:bg-gray-200 dark:bg-[#2b2b2b] dark:hover:bg-[#1b1b1b]" : "bg-gray-300 dark:bg-[#1a1a1a] opacity-60 cursor-wait"} duration-300 flex justify-center gap-3 px-5 py-3 rounded-2xl items-center`}
            >
                <IoCloudUploadOutline size={21} />
                {isEngineLoaded ? "Upload Image" : "Loading Engine..."}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </>
    );
};

export default Input;
