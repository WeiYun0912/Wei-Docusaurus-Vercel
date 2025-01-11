import React, { useEffect, useRef } from "react";
import styles from "./styles.module.css";
import BrowserOnly from "@docusaurus/BrowserOnly";

const AnimatedBackground = ({ variant = "default" }) => {
    const containerId = useRef(`particles-${Math.random().toString(36).substr(2, 9)}`);

    const getColors = (variant) => {
        return variant === "primary" ? ["#ffffff", "#fffacd", "#ffd700"] : ["#ffffff", "#e6e6fa", "#b0c4de"];
    };

    useEffect(() => {
        let isMounted = true;

        const initializeParticles = () => {
            if (!isMounted) return;

            const particlesElement = document.getElementById(containerId.current);
            if (!particlesElement || !window.particlesJS) {
                setTimeout(initializeParticles, 100);
                return;
            }

            const cleanup = () => {
                if (window.pJSDom && Array.isArray(window.pJSDom)) {
                    window.pJSDom.forEach((dom) => {
                        try {
                            if (dom && dom.pJS && dom.pJS.fn && dom.pJS.fn.vendors) {
                                dom.pJS.fn.vendors.destroypJS();
                            }
                        } catch (e) {
                            console.error("Error cleaning up particle instance:", e);
                        }
                    });
                    window.pJSDom = [];
                }
            };

            cleanup();

            try {
                const colors = getColors(variant);
                window.particlesJS(containerId.current, {
                    particles: {
                        number: {
                            value: 50, // 減少一點粒子數量來平衡性能
                            density: {
                                enable: true,
                                value_area: 1000,
                            },
                        },
                        color: {
                            value: colors,
                        },
                        shape: {
                            type: ["circle", "edge", "star"], // 添加不同形狀的粒子
                            stroke: {
                                width: 0,
                                color: "#000000",
                            },
                        },
                        opacity: {
                            value: 0.6,
                            random: true,
                            anim: {
                                enable: true,
                                speed: 0.3,
                                opacity_min: 0.1,
                                sync: false,
                            },
                        },
                        size: {
                            value: 3,
                            random: true,
                            anim: {
                                enable: true,
                                speed: 0.5,
                                size_min: 0.1,
                                sync: false,
                            },
                        },
                        line_linked: {
                            enable: false,
                        },
                        move: {
                            enable: true,
                            speed: 0.5,
                            direction: "none",
                            random: true,
                            straight: false,
                            out_mode: "out",
                            bounce: false,
                            attract: {
                                enable: true,
                                rotateX: 600,
                                rotateY: 1200,
                            },
                        },
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: true,
                                mode: ["bubble", "repulse"],
                            },
                            onclick: {
                                enable: true,
                                mode: "push",
                            },
                            resize: true,
                        },
                        modes: {
                            bubble: {
                                distance: 150,
                                size: 4,
                                duration: 2,
                                opacity: 0.8,
                                speed: 3,
                            },
                            repulse: {
                                distance: 100,
                                duration: 0.4,
                            },
                            push: {
                                particles_nb: 4,
                            },
                        },
                    },
                    retina_detect: true,
                    fps_limit: 60,
                });

                // 添加 UFO 動畫
                // 創建多個 UFO
                const ufos = [
                    { class: styles.ufo1, image: "ufo.png" },
                    { class: styles.ufo2, image: "ufo2.png" },
                    { class: styles.ufo3, image: "ufo.png" },
                    { class: styles.ufo4, image: "ufo2.png" },
                ];

                ufos.forEach(({ class: className, image }) => {
                    const ufoElement = document.createElement("div");
                    ufoElement.className = `${styles.ufo} ${className}`;
                    ufoElement.style.backgroundImage = `url('/img/${image}')`;
                    particlesElement.appendChild(ufoElement);
                });
            } catch (error) {
                console.error("Error initializing particles:", error);
            }
        };

        initializeParticles();

        return () => {
            isMounted = false;
            if (window.pJSDom && Array.isArray(window.pJSDom)) {
                try {
                    window.pJSDom.forEach((dom) => {
                        if (dom && dom.pJS && dom.pJS.fn && dom.pJS.fn.vendors) {
                            dom.pJS.fn.vendors.destroypJS();
                        }
                    });
                    window.pJSDom = [];
                } catch (e) {
                    console.error("Error during cleanup:", e);
                }
            }
        };
    }, [variant]);

    return (
        <BrowserOnly>
            {() => (
                <div className={styles.particlesContainer}>
                    <div id={containerId.current} className={styles.particles} />
                </div>
            )}
        </BrowserOnly>
    );
};

export default AnimatedBackground;
