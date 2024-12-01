import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ThreeBackground = ({ variant }) => {
    const containerRef = useRef();
    const sceneRef = useRef();
    const cameraRef = useRef();
    const rendererRef = useRef();

    useEffect(() => {
        // Scene setup
        sceneRef.current = new THREE.Scene();
        cameraRef.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(rendererRef.current.domElement);

        // Create floating particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1000;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        const color = variant === "primary" ? new THREE.Color(0x2e8555) : new THREE.Color(0x25c2a0);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;

            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
        }

        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        sceneRef.current.add(particles);

        cameraRef.current.position.z = 5;

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);

            particles.rotation.x += 0.0003;
            particles.rotation.y += 0.0005;

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            containerRef.current?.removeChild(rendererRef.current.domElement);
        };
    }, [variant]);

    return <div ref={containerRef} className="absolute inset-0 -z-10" />;
};

export default ThreeBackground;
