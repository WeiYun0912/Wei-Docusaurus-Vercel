import React, { useRef } from "react";
import Layout from "@theme/Layout";
import { motion, useScroll } from "framer-motion";

const achievements = [
    {
        title: "2018 亞洲跨國際黑克松 入圍台灣前五名",
        prize: "73,000",
    },
    {
        title: "2018 亞洲跨國際黑克松 最佳黑客獎",
        prize: "22,400",
    },
    {
        title: "2018 資訊應用創新競賽 教育開放資料組-第二名",
        prize: "50,000",
    },
    {
        title: "2019 資料創新應用競賽 多元氣象服務組-銅獎",
        prize: "50,000",
    },
    {
        title: "校內專題競賽(三) 第一名",
        prize: "8,000",
    },
    {
        title: "校內專題競賽(二) 第二名",
        prize: "5,000",
    },
    {
        title: "樹德大使選拔 知性大使",
        prize: "8,000",
    },
    {
        title: "2021 第 26 屆大專校院資訊應用服務創新競賽 入圍亞太中文組",
    },
    {
        title: "2019 臺南市資料視覺挑戰賽 入圍",
    },
    {
        title: "2018 資料創新應用競賽 入圍社會經濟空間組",
    },
];

// 修改 Gallery Section 部分
const galleryVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const photoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.5,
        },
    },
};

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll();

    return (
        <Layout title="About Me" description="About Me">
            <div className="relative min-h-screen from-gray-900 to-black">
                <div className="absolute inset-0via-transparent from-black/50 to-black/50" />

                {/* Hero Section */}
                <div className="overflow-hidden relative">
                    <div className="absolute inset-0 to-transparent from-primary-500/10" />
                    <div className="container px-4 pt-24 pb-4 mx-auto">
                        <motion.div className="mx-auto max-w-4xl text-center">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="mb-6 text-5xl font-bold md:text-6xl"
                            >
                                <span className="bg-clip-text bg-gradient-to-r from-primary-500 to-primary-300">
                                    WeiWei
                                </span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="mb-8 text-xl text-gray-300 md:text-2xl"
                            >
                                Frontend Developer • Content Creator
                            </motion.p>
                        </motion.div>
                    </div>
                </div>

                <main ref={containerRef} className="container mx-auto px-4 py-12 max-w-[1200px]">
                    <div className="space-y-32">
                        {/* About Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="mx-auto max-w-3xl"
                        >
                            <h2 className="mb-8 text-3xl font-bold">About Me</h2>
                            <div className="max-w-none prose prose-lg prose-invert">
                                <p>
                                    在就讀大學的期間開始學習寫程式，喜歡利用程式幫朋友或家人解決問題。
                                    同時也會將所學之技術寫成技術文章上傳至
                                    <a
                                        href="https://medium.com/@weiyun0912"
                                        target="_blank"
                                        className="text-primary-400 hover:text-primary-300"
                                    >
                                        Medium Post
                                    </a>
                                    和
                                    <a
                                        href="https://github.com/WeiYun0912"
                                        target="_blank"
                                        className="text-primary-400 hover:text-primary-300"
                                    >
                                        Github
                                    </a>
                                    。
                                </p>
                                <p>
                                    <a
                                        href="https://www.youtube.com/@weiweicoding"
                                        target="_blank"
                                        className="text-primary-400 hover:text-primary-300"
                                    >
                                        Youtube
                                    </a>
                                    頻道會不定時上傳程式教學，一方面是當自己忘記某個程式如何撰寫或使用時可以回顧，
                                    另一方面是希望能將撰寫時踩過的坑分享給正在學習的人。
                                </p>
                            </div>
                            <div className="grid gap-6 mt-8 md:grid-cols-2">
                                <div className="p-6 rounded-xl backdrop-blur-sm bg-white/5">
                                    <h3 className="mb-2 text-xl font-semibold text-primary-400">碩士畢業於</h3>
                                    <p className="text-gray-300">國立高雄科技大學－電子工程學系 🎓︎</p>
                                </div>
                                <div className="p-6 rounded-xl backdrop-blur-sm bg-white/5">
                                    <h3 className="mb-2 text-xl font-semibold text-primary-400">大學畢業於</h3>
                                    <p className="text-gray-300">私立樹德科技大學－資訊工程學系 🎓︎</p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Skills Section */}
                        {/* <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute inset-0 rounded-3xl from-primary-500/10 to-primary-800/10 -z-10" />
                            <div className="p-8 md:p-12">
                                <h2 className="mb-12 text-3xl font-bold text-center">Technical Skills</h2>
                                <div className="grid gap-16">
                                    {[
                                        { title: "Current Stack", stack: currentTechStack },
                                        { title: "Previously Worked With", stack: previousTechStack },
                                    ].map((section, idx) => (
                                        <div key={idx}>
                                            <h3 className="mb-8 text-2xl font-semibold text-primary-400">
                                                {section.title}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                                {section.stack.map((tech, index) => (
                                                    <TechCard key={tech} tech={tech} index={index} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.section> */}

                        {/* Achievements Section */}
                        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                            <h2 className="mb-12 text-3xl font-bold text-center">Achievements</h2>

                            <motion.div
                                key={1}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 1 * 0.1 }}
                                className="p-6 mb-2 rounded-xl backdrop-blur-sm transition-all bg-white/5 hover:bg-white/10"
                            >
                                <a
                                    href="https://www.sciencedirect.com/science/article/pii/S2405959523001650"
                                    target="_blank"
                                >
                                    <h3 lassName="mb-3 text-xl font-semibold">
                                        碩士論文：Applying Ethereum blockchain and IPFS to construct a multi-party
                                        used-car trading and management system (ICT Express | Journal)
                                    </h3>
                                </a>
                            </motion.div>
                            <div className="grid gap-8 md:grid-cols-2">
                                {achievements.map((achievement, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-6 rounded-xl backdrop-blur-sm transition-all bg-white/5 hover:bg-white/10"
                                    >
                                        <h3 className="mb-3 text-xl font-semibold">{achievement.title}</h3>
                                        {achievement.prize && (
                                            <p className="font-medium text-primary-400">獎金：${achievement.prize}</p>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Gallery Section */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <h2 className="mb-12 text-3xl font-bold text-center">Awards Gallery</h2>
                            <motion.div
                                variants={galleryVariants}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {[...Array(14)].map((_, index) => (
                                    <motion.div
                                        key={index}
                                        variants={photoVariants}
                                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-enhanced"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <motion.img
                                            src={require(`@site/static/img/about/${index + 1}.jpg`).default}
                                            alt={`Award ${index + 1}`}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-all duration-300 from-black/70 via-black/20 group-hover:opacity-100" />
                                        <div className="absolute right-0 bottom-0 left-0 p-4 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0">
                                            <p className="text-sm font-medium text-white">獎狀 {index + 1}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.section>
                    </div>
                </main>
            </div>
        </Layout>
    );
}

// 擴展技術圖標映射
function getTechIcon(tech) {
    const icons = {
        "Visual Studio Code": "💻",
        HTML5: "🌐",
        CSS3: "🎨",
        JavaScript: "⚡",
        React: "⚛️",
        "Node.JS": "🚀",
        MongoDB: "🗃️",
        Python: "🐍",
        Git: "📚",
        Docker: "🐳",
        jQuery: "🔌",
        PHP: "🐘",
        Webpack: "📦",
        JSON: "📄",
        Markdown: "📝",
        "React Native": "📱",
        "Material UI": "🎨",
        Redux: "🔄",
        "React Query": "🔍",
        Ethereum: "💎",
        Solidity: "📜",
        MySQL: "💾",
        Firebase: "🔥",
        Heroku: "☁️",
        Figma: "🎯",
        Trello: "📋",
        GraphQL: "🔮",
        Linux: "🐧",
        "Kali Linux": "🔒",
        Puppeteer: "🤖",
        "React Router": "🛣️",
        "web3.js": "🌐",
        "Apollo GraphQL": "🚀",
        "Codeigniter 3": "🔥",
    };
    return icons[tech] || "🔧"; // 默認圖標
}
