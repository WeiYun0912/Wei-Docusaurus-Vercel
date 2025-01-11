// GlobalBackground.jsx
import React, { useState, useEffect } from "react";
import AnimatedBackground from "../components/AnimatedBackground/AnimatedBackground";
import { useLocation } from "@docusaurus/router";

const GlobalBackground = () => {
    const location = useLocation();
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const isDocsPage = location.pathname.includes("/docs");
        setShouldRender(!isDocsPage);
    }, [location.pathname]);

    // 簡化處理，只在非 docs 頁面渲染
    if (!shouldRender) return null;

    return <AnimatedBackground variant="primary" />;
};

export default GlobalBackground;
