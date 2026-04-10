import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    if (request.nextUrl.pathname.startsWith("/result")) {
        const medicinName = searchParams.has("medicineName");
        const batchNo = searchParams.has("batchNo");

        if (!medicinName || !batchNo) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/result/:path*",
};
