"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 1280, height: 720 },
                    audio: false,
                });

                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.log(error);
            }
        })();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    return (
        <div className="h-screen w-screen bg-background relative">
            <Link href="/" className="absolute top-0 left-0 z-40">
                <IoArrowBackOutline
                    className="mt-10 ml-10 cursor-pointer"
                    size={30}
                />
            </Link>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full"
            ></video>
        </div>
    );
};

export default Camera;
