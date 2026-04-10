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
            fs: { browser: "./empty-module.ts" },
            path: { browser: "./empty-module.ts" },
        },
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin",
                    },
                    {
                        key: "Cross-Origin-Embedder-Policy",
                        value: "require-corp",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
