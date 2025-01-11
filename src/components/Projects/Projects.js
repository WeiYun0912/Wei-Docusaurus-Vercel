import React from "react";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "./styles.module.css";

const Projects = ({ ProjectsData, title, variant = "primary" }) => {
    return (
        <section className={styles.projectsContainer}>
            <div className={styles.projectsBox}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className={styles.projectsTitle}>{title}</h2>
                    <p className={styles.projectsSubtitle}>
                        {variant === "primary"
                            ? "探索我在學術旅程中完成的專案作品，每一個都代表著獨特的學習經驗和成長。"
                            : "這裡展示了我的個人作品集，體現了我對程式開發的熱情和創意。"}
                    </p>
                </motion.div>

                <div className={styles.projectsGrid}>
                    {ProjectsData?.map((project, index) => (
                        <ProjectCard key={project.id} {...project} index={index} variant={variant} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({
    projectTitle,
    projectImage,
    projectDescribe,
    tech,
    role,
    githubUrl,
    channelUrl,
    awards,
    index,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={styles.projectCard}
        >
            <div className={styles.imageContainer}>
                <LazyLoadImage src={projectImage} alt={projectTitle} effect="opacity" className={styles.projectImage} />
            </div>

            <div className={styles.projectContent}>
                <h3 className={styles.projectTitle}>{projectTitle}</h3>
                <p className={styles.projectDescription}>{projectDescribe}</p>

                {tech && (
                    <div className={styles.techStack}>
                        {role && <span className={styles.techTag}>{role}</span>}
                        {tech.map((item) => (
                            <span key={item.name} className={styles.techTag}>
                                {item.name}
                            </span>
                        ))}
                    </div>
                )}

                {awards && (
                    <div className={styles.awards}>
                        {awards.map((award, i) => (
                            <div key={i} className={styles.award}>
                                <span>🏆</span>
                                <span>{award}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.projectLinks}>
                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`${styles.projectLink} ${styles.primaryLink}`}
                        >
                            <span>查看專案</span>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                        </a>
                    )}
                    {channelUrl && (
                        <a
                            href={channelUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`${styles.projectLink} ${styles.secondaryLink}`}
                        >
                            <span>觀看影片</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Projects;
