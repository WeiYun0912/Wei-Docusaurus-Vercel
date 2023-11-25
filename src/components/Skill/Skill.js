import React from "react";
import styles from "./styles.module.css";
import Tilt from "react-tilt";
import { motion } from "framer-motion";

const Skill = ({ Skills }) => {
  return (
    <>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        關於我
      </motion.h1>
      <div className={styles.skillContainer}>
        {Skills?.map((skill, i) => (
          <SkillCard key={i} order={i} {...skill} />
        ))}
      </div>
    </>
  );
};

const SkillCard = ({ name, img, tags, order }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: "tween",
        delay: order * 0.3,
      }}
    >
      <Tilt className={styles.tilt}>
        <div className={styles.tiltContainer}>
          <div
            options={{
              max: 45,
              scale: 1,
              speed: 450,
            }}
            className={styles.tiltContentContainer}
          >
            <img src={img} alt={name} className={styles.tiltImage} />
            <h3 className={styles.tiltTitle}>{name}</h3>
          </div>
          <div className={styles.tiltTags}>
            {tags.map((tag) => (
              <div
                className={styles.tag}
                style={{ backgroundColor: tag.bgColor }}
              >
                <span>{tag.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

export default Skill;
