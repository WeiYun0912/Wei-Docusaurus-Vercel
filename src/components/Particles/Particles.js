import React, { useEffect } from "react";
import "particles.js";

const Particles = ({ intensity = "low" }) => {
    useEffect(() => {
        const config = {
            particles: {
                number: {
                    value: intensity === "low" ? 30 : 80,
                    density: { enable: true, value_area: 800 },
                },
                color: { value: "#ffffff" },
                opacity: {
                    value: 0.1,
                    random: true,
                },
                size: {
                    value: 3,
                    random: true,
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: "none",
                    random: true,
                    straight: false,
                    outMode: "out",
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.1,
                    width: 1,
                },
            },
        };

        window.particlesJS(`particles-${intensity}`, config);

        return () => {
            // Cleanup if needed
        };
    }, [intensity]);

    return <div id={`particles-${intensity}`} className="absolute inset-0 pointer-events-none" />;
};

export default Particles;
