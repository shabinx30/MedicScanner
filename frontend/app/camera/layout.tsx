import React, { ViewTransition } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ViewTransition enter="slide-in" exit="slide-out">
            {children}
        </ViewTransition>
    );
};

export default Layout;
