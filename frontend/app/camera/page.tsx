"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import useFullScreen from "@/libs/FullScreen";
import { Guidance, ScanPhase } from "@/types/camera.type";
import { GUIDANCE_TEXT, PHASE_TEXT } from "@/const/camera";
import React from "react";

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cameraPage = useRef<HTMLDivElement>(null);
    const { isEngineLoaded, setEnginLoaded } = useAppContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frontFrameRef = useRef<string | null>(null);
    const loopRef = useRef<number>(0);
    const textRecWorkerRef = useRef<Worker | null>(null);

    const [phase, setPhase] = useState<ScanPhase>("detecting");
    const [guidance, setGuidance] = useState<Guidance>("no_object");
    const [images, setImages] = useState<string[]>([]);
    const [exText, setExText] = useState<any>([]);
    const [isFlipped, setFlipped] = useState(false);
    const [readyBtn, setReadyBtn] = useState(false);
    const [isUserReady, setUserReady] = useState(false);

    // fullscreen related
    const { tryFullscreen } = useFullScreen(cameraPage);

    const stopLoop = () => {
        if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };

    useEffect(() => {
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        width: 1280,
                        height: 720,
                    },
                    audio: false,
                });

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                // Attempt fullscreen (will fall back to user-gesture on Safari)
                // tryFullscreen();
            } catch (error) {
                console.log(error);
            }
        })();

        textRecWorkerRef.current = new Worker(
            new URL("@/workers/text_rec.worker.ts", import.meta.url),
        );

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }

            stopLoop();
            if (textRecWorkerRef.current) {
                textRecWorkerRef.current.terminate();
            }
            // Exit fullscreen on unmount
            // if (isFullscreen()) {
            //     exitFullscreen().catch(() => {});
            // }
        };
    }, [tryFullscreen]);

    useEffect(() => {
        stopLoop();
        if (!isEngineLoaded) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const tryStart = () => {
            // Sync canvas to actual video dimensions
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                if (phase === "detecting") startDetectionLoop("front");
                if (phase === "waiting_flip") startDetectionLoop("flip");
            } else {
                // Video not ready yet, wait for it
                video.addEventListener(
                    "loadeddata",
                    () => {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        if (phase === "detecting") startDetectionLoop("front");
                        if (phase === "waiting_flip")
                            startDetectionLoop("flip");
                    },
                    { once: true },
                );
            }
        };

        tryStart();
    }, [phase, isEngineLoaded]);

    const runChecks = async (cv: any, src: any) => {
        const frameArea = src.rows * src.cols;
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        // Brighness check
        const brightness = cv.mean(gray)[0];
        if (brightness < 50) {
            gray.delete();
            return { pass: false, reason: "dark" as Guidance };
        }

        // Glare check
        const thresh = new cv.Mat();
        cv.threshold(gray, thresh, 240, 255, cv.THRESH_BINARY);
        const glarePixel = cv.countNonZero(thresh);
        thresh.delete();

        if (glarePixel > frameArea * 0.05) {
            gray.delete();
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
            return { pass: false, reason: "hold_steady" as Guidance };
        }

        const texts = await handleTextDetection();

        gray.delete();

        if (
            texts.length >= 2 &&
            (texts[0].text.length > 4 || texts[1].text.length > 4)
        ) {
            setExText((p: any) => {
                return [...p, texts];
            });
            return { pass: true, reason: "none" as Guidance };
        }

        return { pass: false, reason: "move_closer" as Guidance };
    };

    const handleTextDetection = async (): Promise<any[]> => {
        if (!isEngineLoaded || !canvasRef.current || !textRecWorkerRef.current)
            return [];

        return new Promise((resolve) => {
            try {
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = 640;
                tempCanvas.height = 640;
                const tempCtx = tempCanvas.getContext("2d");
                if (tempCtx && canvasRef.current) {
                    tempCtx.drawImage(canvasRef.current, 0, 0, 640, 640);
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

    const startDetectionLoop = (mode: "front" | "flip") => {
        const cv = (window as any).cv;
        if (!cv || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

        const fps = 10;
        const fpsInterval = 1000 / fps;
        let then = window.performance.now();
        let isProcessing = false;

        const loop = async (timestamp: DOMHighResTimeStamp) => {
            if (isProcessing) {
                loopRef.current = requestAnimationFrame(loop);
                return;
            }

            const elapsed = timestamp - then;

            if (elapsed > fpsInterval) {
                then = timestamp - (elapsed % fpsInterval);

                isProcessing = true;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const src = cv.imread(canvas);

                if (mode === "front") {
                    const { pass, reason } = await runChecks(cv, src);
                    setGuidance(reason);

                    if (pass) {
                        captureImage(canvas, "front");
                        setPhase("front_captured");
                        setTimeout(() => setPhase("waiting_flip"), 1500);
                        src.delete();
                        return;
                    }
                }

                if (mode === "flip") {
                    if (frontFrameRef.current) {
                        if (!isFlipped) {
                            const flipped = detectFlip(cv, src, canvas);
                            if (flipped) {
                                setFlipped(true);
                                setReadyBtn(true);
                                return;
                            }
                        }
                        const { pass, reason } = await runChecks(cv, src);
                        setGuidance(reason);
                        if (pass) {
                            captureImage(canvas, "back");
                            setPhase("back_captured");
                            setTimeout(() => setPhase("done"), 1500);
                            src.delete();
                            return;
                        }
                    }
                }

                src.delete();
                isProcessing = false;
            }

            loopRef.current = requestAnimationFrame(loop);
        };

        loopRef.current = requestAnimationFrame(loop);
    };

    const detectFlip = (
        cv: any,
        currentFrame: any,
        canvas: HTMLCanvasElement,
    ): boolean => {
        if (!frontFrameRef.current) return false;

        // Load saved front image into a Mat
        const img = new Image();
        img.src = frontFrameRef.current;
        const offscreen = document.createElement("canvas");
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const ctx = offscreen.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const frontMat = cv.imread(offscreen);

        // Convert both to grayscale
        const grayFront = new cv.Mat();
        const grayCurrent = new cv.Mat();
        cv.cvtColor(frontMat, grayFront, cv.COLOR_RGBA2GRAY);
        cv.cvtColor(currentFrame, grayCurrent, cv.COLOR_RGBA2GRAY);

        // Compute absolute diff
        const diff = new cv.Mat();
        cv.absdiff(grayFront, grayCurrent, diff);
        const totalPixels = diff.rows * diff.cols;
        const changedPixels = cv.countNonZero(diff); // pixels that changed

        frontMat.delete();
        grayFront.delete();
        grayCurrent.delete();
        diff.delete();

        const changeRatio = changedPixels / totalPixels;
        return changeRatio > 0.45; // 45% of pixels changed = flipped
    };

    const captureImage = (
        canvas: HTMLCanvasElement,
        side: "front" | "back",
    ) => {
        const dataUrl = canvas.toDataURL("image/jpeg");
        if (side === "front") frontFrameRef.current = dataUrl;
        setImages((prev) => [...prev, dataUrl]);
    };

    // When phase === 'done', send both to NestJS
    useEffect(() => {
        if (phase === "done" && images.length >= 2) {
            console.log(images);
        }
    }, [phase, images]);

    return (
        <>
            <div
                ref={cameraPage}
                className="h-screen w-screen bg-background relative"
            >
                <Link
                    href="/"
                    className="absolute top-7.5 left-7.5 z-40 bg-gray-200 dark:bg-[#2b2b2b] py-2 px-3 rounded-2xl"
                >
                    <IoArrowBackOutline
                        className="text-black dark:text-[#41f5ff]"
                        size={30}
                    />
                </Link>
                {!isEngineLoaded && (
                    <h3 className="absolute z-30 bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2">
                        Loading Camera Engine...
                    </h3>
                )}
                {readyBtn ? (
                    !isUserReady ? (
                        <div className="absolute right-1/2 translate-x-1/2 bottom-4 z-30 bg-white py-4 px-10 rounded-2xl flex flex-col items-center gap-3">
                            <p className="text-center text-sm">
                                Ready to take the back side?
                            </p>
                            <button
                                onClick={() => {
                                    setUserReady(true);
                                    startDetectionLoop("flip");
                                }}
                                className="bg-black text-[#41f5ff] rounded-2xl px-4 py-1.5 cursor-pointer"
                            >
                                Ready
                            </button>
                        </div>
                    ) : (
                        <motion.p
                            layout
                            transition={{ duration: 0.1, ease: "easeIn" }}
                            className="absolute right-1/2 translate-x-1/2 bottom-4 z-30 bg-white dark:bg-black p-4"
                        >
                            {guidance !== "none"
                                ? GUIDANCE_TEXT[guidance]
                                : PHASE_TEXT[phase]}
                        </motion.p>
                    )
                ) : (
                    <motion.p
                        layout
                        transition={{ duration: 0.1, ease: "easeIn" }}
                        className="absolute right-1/2 translate-x-1/2 bottom-4 z-30 bg-white dark:bg-black p-4"
                    >
                        {guidance !== "none"
                            ? GUIDANCE_TEXT[guidance]
                            : PHASE_TEXT[phase]}
                    </motion.p>
                )}

                <div className="absolute z-30 right-0 bottom-1/2 translate-y-1/2">
                    {images.length ? (
                        images.map((_, key) => (
                            <p className="bg-white dark:bg-black p-6" key={key}>
                                Image taken
                                <br />
                                {exText[key].map(
                                    (te: { text: string }, i: number) => (
                                        <React.Fragment key={i}>
                                            <span>{te.text}</span>
                                            <br />
                                        </React.Fragment>
                                    ),
                                )}
                                <img className="w-[5em]" src={images[key]} alt={String(key)} width={100} height={100} />
                            </p>
                        ))
                    ) : (
                        <p className="bg-white dark:bg-black p-6">No image</p>
                    )}
                </div>
                <motion.div
                    initial={{ opacity: 1, backdropFilter: "blur(10px)" }}
                    animate={{
                        opacity: isEngineLoaded ? 0 : 1,
                        backdropFilter: isEngineLoaded
                            ? "blur(0px)"
                            : "blur(10px)",
                        // This ensures it doesn't block clicks after fading out
                        pointerEvents: isEngineLoaded ? "none" : "auto",
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-black/40 w-full h-full absolute inset-0 z-20"
                />
                <div
                    className={`absolute w-full h-full z-23 transition-colors duration-300 ${guidance === "glare" ? "bg-red-500/25" : guidance === "hold_steady" ? "bg-blue-500/25" : "bg-transparent"}`}
                ></div>
                <div className="flex h-screen justify-center items-center relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        // style={{ transform: "scaleX(-1)" }}
                        className="w-screen h-screen rounded-4xl object-cover object-center"
                    ></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            </div>
            <Script
                src="/opencv.js"
                strategy="lazyOnload"
                onLoad={() => {
                    const cv = (window as any).cv;
                    if (cv && cv.Mat) {
                        // Already initialized
                        setEnginLoaded(true);
                    } else if (cv) {
                        // WASM still compiling — wait for runtime
                        cv["onRuntimeInitialized"] = async () => {
                            setEnginLoaded(true);
                        };
                    }
                }}
            />
        </>
    );
};

export default Camera;
