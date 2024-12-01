import React from "react";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import VanillaTilt from "vanilla-tilt";
import { useEffect, useRef } from "react";

const Skill = ({ Skills }) => {
    return (
        <section className={styles.skillSection}>
            <motion.h2
                className={styles.sectionTitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                關於我
            </motion.h2>
            <div className={styles.skillGrid}>
                {Skills?.map((skill, i) => (
                    <SkillCard key={i} order={i} {...skill} />
                ))}
            </div>
        </section>
    );
};

const SkillCard = ({ name, img, tags, order }) => {
    const tiltRef = useRef(null);

    useEffect(() => {
        VanillaTilt.init(tiltRef.current, {
            max: 25,
            speed: 400,
            glare: true,
            "max-glare": 0.5,
        });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: order * 0.2 }}
            viewport={{ once: true }}
            className={styles.skillCardWrapper}
        >
            <div ref={tiltRef} className={styles.skillCard}>
                <div className={styles.skillContent}>
                    <div className={styles.skillImageWrapper}>
                        <img src={img} alt={name} className={styles.skillImage} />
                    </div>
                    <h3 className={styles.skillTitle}>{name}</h3>
                    <div className={styles.tagContainer}>
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className={styles.tag}
                                style={{
                                    background: `linear-gradient(135deg, ${tag.bgColor}, ${tag.bgColor}88)`,
                                    boxShadow: `0 4px 15px ${tag.bgColor}33`,
                                }}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Skill;
