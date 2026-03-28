import { RefObject, useCallback } from "react";

/** Cross-browser fullscreen request (handles Safari) */
export function requestFullscreen(el: HTMLElement): Promise<void> {
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
export function exitFullscreen(): Promise<void> {
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
export function isFullscreen(): boolean {
    const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
    };
    return !!(document.fullscreenElement || doc.webkitFullscreenElement);
}

const useFullScreen = (cameraPage: RefObject<HTMLDivElement | null>) => {
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

    return { tryFullscreen };
};

export default useFullScreen;
