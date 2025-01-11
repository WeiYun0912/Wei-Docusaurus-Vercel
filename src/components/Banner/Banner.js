import React from "react";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";
import BrowserOnly from "@docusaurus/BrowserOnly";

const Banner = () => {
    return (
        <BrowserOnly fallback={<Loading />}>
            {() => (
                <div className={styles.bannerContainer}>
                    <div className={styles.bannerContent}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className={styles.bannerBox}
                        >
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className={styles.bannerTitle}
                            >
                                Learn. Build. Inspire.
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className={styles.bannerSubtitle}
                            >
                                <span className={styles.gradientText}>Frontend Developer</span>
                                <span className={styles.separator}>•</span>
                                <span className={styles.gradientText}>Content Creator</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className={styles.bannerRewardTotal}
                            >
                                Everyday is another day to be better than you were yesterday
                            </motion.h2>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                                className={styles.buttonGroup}
                            >
                                <Link to="/docs/intro">
                                    <button className={styles.primaryButton}>
                                        我的程式筆記
                                        <span className={styles.buttonIcon}>📚</span>
                                    </button>
                                </Link>
                                <a href="#tech-stack" className={styles.secondaryButton}>
                                    了解更多
                                    <span className={styles.buttonIcon}>↓</span>
                                </a>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.1 }}
                                className={styles.bannerSocialMedia}
                            >
                                {[
                                    { url: "https://github.com/WeiYun0912", icon: "github.png", label: "GitHub" },
                                    {
                                        url: "https://www.youtube.com/channel/UCy1Q33r6POsxGTtZcOF--Fw",
                                        icon: "youtube.svg",
                                        label: "YouTube",
                                    },
                                    {
                                        url: "https://www.instagram.com/weiwei225/",
                                        icon: "instagram.svg",
                                        label: "Instagram",
                                    },
                                    { url: "https://medium.com/@weiyun0912", icon: "mediumpost.png", label: "Medium" },
                                ].map((social) => (
                                    <Link
                                        key={social.url}
                                        to={social.url}
                                        className={styles.socialLink}
                                        aria-label={social.label}
                                    >
                                        <img
                                            src={`img/${social.icon}`}
                                            alt={social.label}
                                            className={styles.socialIcon}
                                        />
                                    </Link>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            )}
        </BrowserOnly>
    );
};

const Loading = () => (
    <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-16 h-16 rounded-full border-t-2 border-b-2 animate-spin border-primary"></div>
    </div>
);

export default Banner;
