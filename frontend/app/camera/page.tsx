"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import useFullScreen from "@/libs/FullScreen";

type ScanPhase =
    | "detecting"
    | "front_captured"
    | "waiting_flip"
    | "back_captured"
    | "done";
type Guidance =
    | "none"
    | "move_closer"
    | "hold_steady"
    | "no_object"
    | "dark"
    | "glare";

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cameraPage = useRef<HTMLDivElement>(null);
    const { isCvLoaded, setCvLoaded } = useAppContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevFrameRef = useRef<any>(null);
    const frontFrameRef = useRef<string | null>(null);
    const loopRef = useRef<number>(0);

    const [phase, setPhase] = useState<ScanPhase>("detecting");
    const [guidance, setGuidance] = useState<Guidance>("no_object");
    const [images, setImages] = useState<string[]>([]);

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

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }

            stopLoop();
            // Exit fullscreen on unmount
            // if (isFullscreen()) {
            //     exitFullscreen().catch(() => {});
            // }
        };
    }, [tryFullscreen]);

    useEffect(() => {
        stopLoop();
        if (!isCvLoaded) return;
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
    }, [phase, isCvLoaded]);

    const runChecks = (cv: any, src: any) => {
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
        if (variance < 50) {
            gray.delete();
            return { pass: false, reason: "hold_steady" as Guidance };
        }



        // Object in frame + size check
        // const blurred = new cv.Mat();
        // cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
        // const edges = new cv.Mat();
        // cv.Canny(blurred, edges, 50, 150);

        // const contours = new cv.MatVector();
        // const hierarchy = new cv.Mat();
        // cv.findContours(
        //     edges,
        //     contours,
        //     hierarchy,
        //     cv.RETR_EXTERNAL,
        //     cv.CHAIN_APPROX_SIMPLE,
        // );

        // let maxArea = 0;
        // for (let i = 0; i < contours.size(); i++) {
        //     const area = cv.contourArea(contours.get(i));
        //     if (area > maxArea) {
        //         maxArea = area;
        //     }
        // }

        // contours.delete();
        // hierarchy.delete();
        // blurred.delete();
        // edges.delete();
        gray.delete();

        // if (maxArea < frameArea * 0.08)
        //     return { pass: false, reason: "no_object" as Guidance };
        // if (maxArea < frameArea * 0.25)
        //     return { pass: false, reason: "move_closer" as Guidance };

        // return { pass: true, reason: "none" as Guidance };
        return { pass: false, reason: "none" as Guidance };
    };

    const startDetectionLoop = (mode: "front" | "flip") => {
        const cv = (window as any).cv;
        if (!cv || !videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

        const loop = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const src = cv.imread(canvas);

            if (mode === "front") {
                const { pass, reason } = runChecks(cv, src);
                setGuidance(reason);

                if (pass) {
                    captureImage(canvas, "front");
                    setPhase("front_captured");
                    src.delete();
                    return;
                }
            }

            if (mode === "flip") {
                if (frontFrameRef.current) {
                    const flipped = detectFlip(cv, src, canvas);
                    if (flipped) {
                        const { pass, reason } = runChecks(cv, src);
                        setGuidance(reason);
                        if (pass) {
                            captureImage(canvas, "back");
                            setPhase("done");
                            src.delete();
                            return;
                        }
                    }
                }
            }

            src.delete();
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
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        if (side === "front") frontFrameRef.current = dataUrl;
        setImages((prev) => [...prev, dataUrl]);
    };

    // When phase === 'done', send both to NestJS
    useEffect(() => {
        if (phase === "done" && images.length >= 2) {
            console.log(images);
        }
    }, [phase, images]);

    const GUIDANCE_TEXT: Record<Guidance, string> = {
        none: "",
        no_object: "Point the camera at the medicine",
        move_closer: "Move closer to the medicine",
        hold_steady: "Hold steady...",
        glare: "Too much glare — tilt slightly",
        dark: "Too dark — find better lighting",
    };

    const PHASE_TEXT: Record<ScanPhase, string> = {
        detecting: "Scanning front...",
        front_captured: "Front captured ✓",
        waiting_flip: "Now flip the medicine to show the back",
        back_captured: "Back captured ✓",
        done: "Done! Extracting details...",
    };

    return (
        <>
            <div
                ref={cameraPage}
                className="h-screen w-screen bg-background relative"
            >
                <Link
                    href="/"
                    className="absolute top-7.5 left-7.5 z-40 bg-[#2b2b2b] py-2 px-3 rounded-2xl"
                >
                    <IoArrowBackOutline className="text-[#41f5ff]" size={30} />
                </Link>
                {!isCvLoaded && (
                    <h3 className="absolute z-30 bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2">
                        Loading Camera Engine...
                    </h3>
                )}
                <p className="absolute right-1/2 translate-x-1/2 bottom-4 z-30 bg-black p-4">
                    {guidance !== "none"
                        ? GUIDANCE_TEXT[guidance]
                        : PHASE_TEXT[phase]}
                </p>

                <div className="absolute z-30 right-0 bottom-1/2 translate-y-1/2">
                    {images.length ? (
                        images.map((_, key) => (
                            <p className="bg-black p-6" key={key}>
                                Image teken
                            </p>
                        ))
                    ) : (
                        <p className="bg-black p-6">No image</p>
                    )}
                </div>
                <motion.div
                    initial={{ opacity: 1, backdropFilter: "blur(10px)" }}
                    animate={{
                        opacity: isCvLoaded ? 0 : 1,
                        backdropFilter: isCvLoaded ? "blur(0px)" : "blur(10px)",
                        // This ensures it doesn't block clicks after fading out
                        pointerEvents: isCvLoaded ? "none" : "auto",
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-black/40 w-full h-full absolute inset-0 z-20"
                />
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
                        setCvLoaded(true);
                    } else if (cv) {
                        // WASM still compiling — wait for runtime
                        cv["onRuntimeInitialized"] = () => {
                            setCvLoaded(true);
                        };
                    }
                }}
            />
        </>
    );
};

export default Camera;
