"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

/** Cross-browser fullscreen request (handles Safari) */
function requestFullscreen(el: HTMLElement): Promise<void> {
    if (el.requestFullscreen) {
        return el.requestFullscreen();
    }
    // Safari
    const webkitEl = el as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
    };
    if (webkitEl.webkitRequestFullscreen) {
        return webkitEl.webkitRequestFullscreen();
    }
    return Promise.reject(new Error("Fullscreen API not supported"));
}

/** Cross-browser exit fullscreen */
function exitFullscreen(): Promise<void> {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    }
    const doc = document as Document & {
        webkitExitFullscreen?: () => Promise<void>;
    };
    if (doc.webkitExitFullscreen) {
        return doc.webkitExitFullscreen();
    }
    return Promise.resolve();
}

/** Check if any element is currently fullscreen (cross-browser) */
function isFullscreen(): boolean {
    const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
    };
    return !!(document.fullscreenElement || doc.webkitFullscreenElement);
}

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const cameraPage = useRef<HTMLDivElement>(null);
    const { isCvLoaded, setCvLoaded } = useAppContext();

    const tryFullscreen = useCallback(() => {
        if (!cameraPage.current || isFullscreen()) return;

        requestFullscreen(cameraPage.current).catch(() => {
            const handler = () => {
                if (cameraPage.current && !isFullscreen()) {
                    requestFullscreen(cameraPage.current).catch((error) => {
                        console.log(error);
                    });
                }
                document.removeEventListener("click", handler, true);
                document.removeEventListener("touchstart", handler, true);
            };
            document.addEventListener("click", handler, {
                capture: true,
                once: true,
            });
            document.addEventListener("touchstart", handler, {
                capture: true,
                once: true,
            });
        });
    }, []);

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
            // Exit fullscreen on unmount
            // if (isFullscreen()) {
            //     exitFullscreen().catch(() => {});
            // }
        };
    }, [tryFullscreen]);

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
                <h3 className="absolute z-30 bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2">
                    {isCvLoaded
                        ? "Camera engine Loaded"
                        : "Loading Camera engine"}
                </h3>
                <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isCvLoaded ? 0 : 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-black w-full h-full absolute inset-0 z-20"
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
                </div>
            </div>
            <Script
                src="/opencv.js"
                strategy="lazyOnload"
                onLoad={() => setCvLoaded(true)}
            />
        </>
    );
};

export default Camera;
