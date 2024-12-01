import React, { useEffect } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Banner from "../components/Banner/Banner";
import Projects from "../components/Projects/Projects";
import TechStack from "../components/TechStack/TechStack";
import Experience from "../components/Experience/Experience";
import BrowserOnly from "@docusaurus/BrowserOnly";
import AnimatedBackground from "../components/AnimatedBackground/AnimatedBackground";
import { useIsHomePage } from "../hooks/useIsHomePage";

// 引入數據
import Project from "../helper/Projects.json";
import SideProject from "../helper/SideProjects.json";

import Tech from "../helper/Tech.json";
import Experiences from "../helper/Experiences.json";

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    const isHomePage = useIsHomePage();
    useEffect(() => {
        // 確保 particles.js 已加載
        if (window.particlesJS) {
            console.log("particles.js loaded");
        }

        // 添加平滑滾動
        const handleClick = (e) => {
            const link = e.target.closest("a");
            if (link && link.hash) {
                e.preventDefault();
                const element = document.querySelector(link.hash);
                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <div data-page-type={isHomePage ? "home" : "other"}>
            <Layout title={siteConfig.title} description="WeiWei 前端程式教學與筆記">
                <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
                    <Banner />

                    <main className="relative">
                        {/* Tech Stack Section */}
                        <section id="tech-stack" className="relative ">
                            <div className="relative z-9999">
                                <TechStack tech={Tech} />
                            </div>
                        </section>

                        {/* Projects Container */}
                        <div id="projects">
                            <Projects ProjectsData={Project} title="曾經參與過的專案" variant="primary" />
                            <Projects ProjectsData={SideProject} title="個人作品集" variant="secondary" />
                        </div>

                        {/* Experience Section */}
                        <section id="experience" className=" relative overflow-hidden">
                            <AnimatedBackground variant="secondary" />
                            <div className="container mx-auto px-4 relative z-10">
                                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                    求學經歷
                                </h2>
                                <BrowserOnly fallback={<Loading />}>
                                    {() => <Experience Experiences={Experiences} />}
                                </BrowserOnly>
                            </div>
                        </section>
                    </main>
                </div>
            </Layout>
        </div>
    );
}

const Loading = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
);
