import React from "react";
import styles from "./styles.module.css";
import { useColorMode } from "@docusaurus/theme-common";
import Tilt from "react-tilt";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { motion } from "framer-motion";

const Projects = ({ ProjectsData, title }) => {
  const { colorMode } = useColorMode();
  return (
    <div className={styles.features}>
      <div className="container">
        <motion.h1
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className={styles.title}
          viewport={{ once: true }}
        >
          {title}
        </motion.h1>

        <div className={styles.cardContainer}>
          {ProjectsData?.map((project) => (
            <ProjectCard key={project.id} {...project} colorMode={colorMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;

const ProjectCard = ({
  projectTitle,
  projectImage,
  projectDescribe,
  tech,
  role,
  githubUrl,
  channelUrl,
  colorMode,
  awards,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        duration: 0.6,
      }}
      viewport={{ once: true }}
      className={styles.tiltContainer}
    >
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className={styles.tilt}
      >
        <div className={styles.tiltImageContainer}>
          <LazyLoadImage
            src={projectImage}
            alt={projectTitle}
            className={styles.tiltImage}
            effect="blur"
          />
        </div>

        <div className={styles.tiltContentContainer}>
          <h3 className={styles.tiltTitle}>{projectTitle}</h3>
          <p className={styles.tiltDesc}>{projectDescribe}</p>

          {role && <p className={styles.tiltRole}>擔任的角色：{role}</p>}
        </div>

        {awards &&
          awards.map((award) => <p className={styles.award}>{award}</p>)}

        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noreferrer noopenner">
            <button
              className={[
                styles.button,
                colorMode === "light" && styles.buttonLight,
              ].join(" ")}
              role="button"
            >
              <span>專案連結</span>
            </button>
          </a>
        )}

        {channelUrl && (
          <a href={channelUrl} target="_blank" rel="noreferrer noopenner">
            <button
              className={[
                styles.button,
                colorMode === "light" && styles.buttonLight,
              ].join(" ")}
              role="button"
            >
              <span>頻道連結</span>
            </button>
          </a>
        )}

        <div className={styles.tiltSkillContainer}>
          {tech?.map((techInfo) => (
            <p
              key={techInfo.name}
              style={{ color: techInfo.color, fontSize: "14px" }}
            >
              #{techInfo.name}{" "}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};
