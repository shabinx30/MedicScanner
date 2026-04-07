import React, { Suspense } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Suspense
            fallback={
                <main className="flex justify-center items-center h-screen w-screen">
                    Searching Medicine...
                </main>
            }
        >
            {children}
        </Suspense>
    );
};

export default Layout;
