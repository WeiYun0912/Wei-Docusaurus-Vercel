import React from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";

const TechStack = ({ tech }) => {
    return (
        <div className={styles.techContainer}>
            <div className={styles.content}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={styles.techTitle}
                >
                    Tech Stack
                </motion.h2>
                <div className={styles.techGrid}>
                    {tech.map((item, index) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.1 }}
                            className={styles.techCard}
                        >
                            <div className={styles.techIconWrapper}>
                                <img src={item.icon} alt={item.name} className={styles.techIcon} />
                                <div className={styles.glowEffect} />
                            </div>
                            <span className={styles.techName}>{item.name}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TechStack;
