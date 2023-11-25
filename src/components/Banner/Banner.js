import React from "react";

import styles from "./styles.module.css";
import Link from "@docusaurus/Link";
import { motion } from "framer-motion";

// TODO: 需要 refactor 針對 motion 的部份可以做成 hoc 但現在懶懶
const Banner = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerBox}>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.bannerTitle}
        >
          Wei's Profile
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.bannerRewardTotal}
        >
          Everyday is another day to be better than you were yesterday
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/docs/intro">
            <button className={styles.bannerPortfolio}>我的程式筆記</button>
          </Link>
        </motion.div>
        <div className={styles.bannerSocialMedia}>
          <Link to="https://github.com/WeiYun0912" style={{ width: "200px" }}>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              src="img/github.png"
              alt="github"
              width={80}
            />
          </Link>
          <Link
            to="https://www.youtube.com/channel/UCy1Q33r6POsxGTtZcOF--Fw"
            style={{ width: "200px" }}
          >
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              src="img/youtube.svg"
              alt="youtube"
              width={80}
            />
          </Link>
          <Link
            to="https://www.instagram.com/weiwei225/"
            style={{ width: "200px" }}
          >
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              src="img/instagram.svg"
              alt="instagram"
              width={80}
            />
          </Link>
          <Link to="https://medium.com/@weiyun0912" style={{ width: "200px" }}>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              src="img/mediumpost.png"
              alt="medium-post"
              width={80}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;
