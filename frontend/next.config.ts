import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    serverExternalPackages: [
        "@gutenye/ocr-browser",
        "@gutenye/ocr-common",
        "@techstark/opencv-js",
        "js-clipper",
    ],
    turbopack: {
        resolveAlias: {
            // Stub out Node.js built-ins for browser builds
            // opencv.js conditionally requires these but doesn't need them in browser
            fs: { browser: "./empty-module.ts" },
            path: { browser: "./empty-module.ts" },
        },
    },
};

export default nextConfig;
