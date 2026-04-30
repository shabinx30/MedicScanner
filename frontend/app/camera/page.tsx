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
import { useRouter } from "next/navigation";
import useScanner from "@/libs/Scanner";

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cameraPage = useRef<HTMLDivElement>(null);
    const {
        isEngineLoaded,
        setEnginLoaded,
        images,
        setImages,
        canvasRef,
        textRecWorkerRef,
        exText,
        setExText,
    } = useAppContext();

    const frontFrameRef = useRef<string | null>(null);
    const loopRef = useRef<number>(0);

    const [phase, setPhase] = useState<ScanPhase>("detecting");
    const [guidance, setGuidance] = useState<Guidance>("no_object");
    const [isFlipped, setFlipped] = useState(false);
    const [readyBtn, setReadyBtn] = useState(false);
    const [isUserReady, setUserReady] = useState(false);
    const router = useRouter();

    const { runChecks } = useScanner();

    // fullscreen related
    const { tryFullscreen } = useFullScreen(cameraPage);

    const stopLoop = () => {
        if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };

    useEffect(() => {
        (async () => {
            try {
                const width = 1280;
                const height = 720;

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                        width: width,
                        height: height,
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

        textRecWorkerRef.current = new Worker("/text_rec.worker.bundle.js");

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
                    setGuidance(() => reason);

                    if (pass) {
                        captureImage(canvas, "front");
                        setPhase(() => "front_captured");
                        setTimeout(() => setExText(() => []), 1000);
                        setTimeout(() => setPhase(() => "waiting_flip"), 1500);
                        src.delete();
                        return;
                    }
                }

                if (mode === "flip") {
                    if (frontFrameRef.current) {
                        if (!isFlipped) {
                            const flipped = detectFlip(cv, src, canvas);
                            if (flipped) {
                                setFlipped(() => true);
                                setReadyBtn(() => true);
                                return;
                            }
                        }
                        const { pass, reason } = await runChecks(cv, src);
                        setGuidance(() => reason);
                        if (pass) {
                            captureImage(canvas, "back");
                            setPhase(() => "back_captured");
                            setTimeout(() => setExText(() => []), 1000);
                            setTimeout(() => setPhase(() => "done"), 1500);
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
        const img = new window.Image();
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
        return changeRatio > 0.9; // 90% of pixels changed = flipped
    };

    const captureImage = (
        canvas: HTMLCanvasElement,
        side: "front" | "back",
    ) => {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        if (side === "front") frontFrameRef.current = dataUrl;
        setImages((prev) => [...prev, dataUrl]);
    };

    // When phase === 'done', send both to NestJS
    useEffect(() => {
        if (phase === "done" && images.length >= 2) {
            router.push("/result?source=images");
        }
    }, [phase, images]);

    return (
        <>
            <div
                ref={cameraPage}
                className="h-screen w-screen bg-background relative font-sans"
            >
                <Link
                    href="/"
                    className="absolute top-2.5 md:top-7.5 left-2.5 md:left-7.5 z-40 bg-white dark:bg-[#1b1b1b] py-2.5 px-3.5 rounded-2xl"
                >
                    <IoArrowBackOutline size={25} />
                </Link>
                {!isEngineLoaded && (
                    <h3 className="absolute z-30 bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2">
                        Loading Camera Engine...
                    </h3>
                )}
                {readyBtn ? (
                    !isUserReady ? (
                        <div className="absolute bottom-4 z-30 flex w-screen justify-center">
                            <div className="text-sm bg-white dark:bg-[#1b1b1b] py-5 px-7.5 md:px-10 rounded-3xl flex flex-col items-center gap-3">
                                <p className="text-center">
                                    Ready to take the back side?
                                </p>
                                <button
                                    onClick={() => {
                                        setUserReady(true);
                                        startDetectionLoop("flip");
                                    }}
                                    className="bg-[#1b1b1b] text-[#41f5ff] dark:bg-[#41f5ff] dark:text-black rounded-2xl px-4 py-1.5 cursor-pointer"
                                >
                                    Ready
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute bottom-4 z-30 w-screen flex justify-center">
                            <motion.div
                                layout
                                transition={{ duration: 0.1, ease: "easeIn" }}
                                className="bg-white h-fit dark:bg-black text-sm rounded-2xl py-4 px-6"
                            >
                                {guidance !== "none"
                                    ? GUIDANCE_TEXT[guidance]
                                    : PHASE_TEXT[phase]}
                            </motion.div>
                        </div>
                    )
                ) : (
                    <div className="absolute bottom-4 z-30 w-screen flex justify-center">
                        <motion.div
                            layout
                            transition={{ duration: 0.1, ease: "easeIn" }}
                            className="bg-white h-fit dark:bg-black text-sm rounded-2xl py-4 px-6"
                        >
                            {guidance !== "none"
                                ? GUIDANCE_TEXT[guidance]
                                : PHASE_TEXT[phase]}
                        </motion.div>
                    </div>
                )}
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
                <div
                    className={`absolute w-full h-full z-23 transition-colors duration-300 ${exText.length && exText[0].box ? "bg-black/50" : "bg-transparent"}`}
                ></div>
                {exText.length && exText[0].box ? (
                    <svg className="absolute w-screen h-screen z-24">
                        {exText.map((text: { box: [] }, index: number) => (
                            <g key={index}>
                                <polygon
                                    points={text.box
                                        .map(
                                            (point: number[]) =>
                                                `${point[0] * 2.3},${point[1] * 1.95}`,
                                        )
                                        .join(" ")}
                                    fill="rgba(0, 255, 0, 0.2)"
                                    stroke="#00FF00"
                                    strokeWidth="2"
                                />
                            </g>
                        ))}
                    </svg>
                ) : (
                    <></>
                )}
                <div className="flex h-screen justify-center items-center relative">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        // style={{ transform: "scaleX(-1)" }}
                        className={`h-screen w-screen md:rounded-4xl object-center object-cover`}
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
