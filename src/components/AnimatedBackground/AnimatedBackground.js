// AnimatedBackground.jsx
import React, { useEffect, useRef } from "react";
import styles from "./styles.module.css";
import BrowserOnly from "@docusaurus/BrowserOnly";

const AnimatedBackground = ({ variant = "default" }) => {
    const containerId = useRef(`particles-${Math.random().toString(36).substr(2, 9)}`);
    const canvasRef = useRef(null);

    const getColors = (variant) => {
        return variant === "primary" ? ["#ffffff", "#fffacd", "#ffd700"] : ["#ffffff", "#e6e6fa", "#b0c4de"];
    };

    useEffect(() => {
        let isMounted = true;
        let resizeTimeout;

        const handleCanvasSize = () => {
            const canvas = document.querySelector(`#${containerId.current} canvas`);
            if (canvas) {
                const pxRatio = window.devicePixelRatio || 1;
                const width = window.innerWidth;
                const height = window.innerHeight;

                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                canvas.width = width * pxRatio;
                canvas.height = height * pxRatio;

                const ctx = canvas.getContext("2d");
                ctx.scale(pxRatio, pxRatio);
            }
        };

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
                            value: 100,
                            density: {
                                enable: true,
                                value_area: 1000,
                            },
                        },
                        color: {
                            value: colors,
                        },
                        shape: {
                            type: ["circle", "edge", "star"],
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
                    retina_detect: false,
                    fps_limit: 60,
                });

                handleCanvasSize();

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

                // 在 initializeParticles 函數中添加
                // 添加流星
                for (let i = 0; i < 3; i++) {
                    const meteor = document.createElement("div");
                    meteor.className = styles.meteor;
                    // 隨機位置但確保在視窗上方開始
                    meteor.style.top = `${Math.random() * 30}%`;
                    meteor.style.left = `${Math.random() * 100}%`;
                    // 隨機延遲，讓流星不同時出現
                    meteor.style.animationDelay = `${i * 2}s`;
                    particlesElement.appendChild(meteor);
                }

                // 添加行星
                const planet = document.createElement("div");
                planet.className = styles.planet;
                planet.style.top = "70%";
                planet.style.right = "10%";
                particlesElement.appendChild(planet);

                // 添加一些小星球
                for (let i = 0; i < 2; i++) {
                    const smallPlanet = document.createElement("div");
                    smallPlanet.className = styles.planet;
                    smallPlanet.style.width = "30px";
                    smallPlanet.style.height = "30px";
                    smallPlanet.style.top = `${20 + i * 40}%`;
                    smallPlanet.style.left = `${10 + i * 70}%`;
                    smallPlanet.style.background = `radial-gradient(circle at 30% 30%, ${
                        i === 0 ? "#ff6b6b" : "#4ecdc4"
                    }, ${i === 0 ? "#c92a2a" : "#1e8b84"})`;
                    particlesElement.appendChild(smallPlanet);
                }
            } catch (error) {
                console.error("Error initializing particles:", error);
            }
        };

        initializeParticles();

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                handleCanvasSize();
            }, 250);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            isMounted = false;
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimeout);

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
                    <div id={containerId.current} className={styles.particles} ref={canvasRef} />
                </div>
            )}
        </BrowserOnly>
    );
};

export default AnimatedBackground;
