import React from "react";
import GlobalBackground from "../components/GlobalBackground";

export default function Root({ children }) {
    return (
        <>
            <GlobalBackground />
            {children}
        </>
    );
}
