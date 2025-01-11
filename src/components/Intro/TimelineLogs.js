import React, { useState, useEffect, useRef } from "react";
import { CalendarDays, Clock, ArrowUp } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const parseLogEntry = (text) => {
    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})：/);
    const date = dateMatch ? dateMatch[1] : "";
    const linkMatch = text.match(/<Link to="([^"]+)">([^<]+)<\/Link>/);
    const link = linkMatch ? linkMatch[1] : "";
    const title = linkMatch ? linkMatch[2] : "";

    return { date, link, title };
};

const TimelineLogs = () => {
    const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const loadMoreRef = useRef(null);

    // Parse all logs (這裡需要替換成你的完整日誌數據)
    const rawLogs = `
        2025-01-08：新增 <Link to="/docs/Sequelize/Sequelize-DB-Migrate">Sequelize DB Migrate</Link> 文章。
        2024-05-28：新增 <Link to="/docs/Others/Windows-Terminal-Better">美化你的 Windows Terminal (oh-my-posh)</Link> 文章。
        2024-05-26：新增 <Link to="/docs/Vue/Vue-Router">Vue Router</Link> 文章。
        2024-05-26：新增 <Link to="/docs/Vue/Vue-Composable">Vue 使用 Composable 將相同的程式碼邏輯抽離</Link> 文章。
        2024-05-24：新增 <Link to="/docs/Vue/Vue-Lazy-Component">Vue Lazy Component (definedAsyncComponent)</Link> 文章。
        2024-05-24：新增 <Link to="/docs/Vue/Vue-Dynamic-Render-Component">Vue 動態載入 Component</Link> 文章。
        2024-05-24：新增 <Link to="/docs/Vue/Vue-Global-Component">Vue 如何定義全域 Component</Link> 文章。
        2024-05-24：新增 <Link to="/docs/Others/Husky-Lint-Staged">檢查 Git Staged 的檔案是否符合 ESLint 規範 (git hook, husky, lint-staged, eslint)</Link> 文章。
        2024-05-23：新增 <Link to="/docs/Vue/Vue-Dynamic-Render-HTML">Vue 使用動態元件渲染 HTML</Link> 文章。
        2024-05-23：新增 <Link to="/docs/Vue/Vue-Provide-Inject">Vue Provide 與 Inject 用法</Link> 文章。
        2024-05-23：新增 <Link to="/docs/Vue/Vue-Directive">Vue 自訂語法 Directive 用法</Link> 文章。
        2024-05-23：新增 <Link to="/docs/Vue/Vue-Basic">Vue 基礎語法</Link> 文章。
        2024-05-22：新增 <Link to="/docs/Vue/Vue-Emit">Vue Emit 用法</Link> 文章。
        2024-05-22：新增 <Link to="/docs/Vue/Vue-Slot">Vue Slot 用法</Link> 文章。
        2024-05-22：新增 <Link to="/docs/Vue/Vue-ESLint">個人常用的 Vue ESLint Rules</Link> 文章。
        2024-02-26：新增 <Link to="/docs/Others/interview">前端面試考題</Link> 文章。
        2024-01-11：新增 <Link to="/docs/TypeScript/TypeScript-Wrapper-Component">React Batter Wrapper Component (ComponentPropsWithoutRef)</Link> 文章。
        2024-01-09：新增 <Link to="/docs/TypeScript/TypeScript-Discriminated-Unions">React Component Discriminated Unions (可辨識複合型別)</Link> 文章。
        2023-11-01：新增 <Link to="/docs/VS%20Code/vsCodeExtensions2">5 個實用的 VS Code 擴充套件 (extensions)</Link> 文章。
        2023-10-28：新增 <Link to="/docs/JavaScript/string">JavaScript 常用的字串方法</Link> 文章。
        2023-10-24：新增 <Link to="/docs/React/Tips/React-State-URL">React State 放在 URL 的好處</Link> 文章。
        2023-05-30：新增 <Link to="/docs/React/Package/React-i18next">React i18next (多國語系切換套件)</Link> 文章。
        2023-04-23：新增 <Link to="/docs/Jest/Jest-React">Jest React (TypeScript) 環境設定</Link> 文章。
        2023-03-21：新增 <Link to="/docs/TypeScript/TypeScript-Zod">TypeScript Zod</Link> 文章。
        2023-03-20：新增 <Link to="/docs/Tailwind/Tailwind-Setup">Tailwind CSS 環境建置與相關語法</Link> 文章。
        2023-03-20：新增 <Link to="/docs/Vite/React-Ts-Tailwind">使用 Vite 快速建立 React + TypeScript + Tailwind CSS 專案</Link> 文章。
        2023-03-19：新增 <Link to="/docs/React%20Native/expogo">React Native Expo 在手機上開發與測試應用程式 (不連到同一個 WIFI 的方法)</Link> 文章。
        2023-03-17：新增 <Link to="/docs/TypeScript/TypeScript-Basic">TypeScript 基礎 (使用 Vite 建立環境)</Link> 文章。
        2023-03-10：新增 <Link to="/docs/React/Package/React-Router-Dom-v6-4">React Router DOM v6.4 介紹</Link> 文章。
        2022-12-28：新增 <Link to="/docs/React/Package/React-Router-Dom-v6">React Router DOM v6 介紹</Link> 文章。 好冷 🥶
        2022-11-12：新增 <Link to="/docs/React/Package/React-Slick">React Slick</Link> 文章。
        2022-11-01：新增 <Link to="/docs/JavaScript/postcss">使用 PostCss 開發 CSS</Link> 文章。
        2022-10-30：新增 <Link to="/docs/CSS/textImage">將文字的背景設定為圖片</Link> 文章。
        2022-10-30：新增 <Link to="/docs/JavaScript/skeleton">使用 Skeleton 增加使用者體驗</Link> 文章。
        2022-10-28：新增 <Link to="/docs/VS%20Code/vsCodeExtensions">實用的 VS Code 套件 (網頁開發)</Link> 文章。
        2022-10-27：新增 <Link to="/docs/React/Tips/React-Lazy">React 使用 Lazy 與 Suspense 動態載入 Component</Link> 文章。
        2022-10-24：新增 <Link to="/docs/Stroybook/Storybook-Basic">Storybook 介紹與實作</Link> 文章。
        2022-10-20：新增 <Link to="/docs/Docusaurus/Docusaurus-Github">將 Docusaurus 專案部署至 Github Page</Link> 文章。
        2022-10-19：新增 <Link to="/docs/React/Tips/React-Search">React 初學者常犯的錯誤 - 搜尋陣列資料</Link> 文章。
        2022-10-19：新增 <Link to="/docs/Docusaurus/Algolia">在 Docusaurus 中使用 Algolia 實作搜尋功能</Link> 文章。
        2022-10-17：新增 <Link to="/docs/Vite/Vite-Github-Pages">將 Vite 專案部署至 Github Pages</Link> 文章。
        2022-10-17：新增 <Link to="/docs/Vite/Vite-Alias">Vite Alias</Link> 文章。
        2022-10-17：新增 <Link to="/docs/Vite/React-Vite">使用 Vite 快速建立 React 專案</Link> 文章。
        2022-10-16：新增 <Link to="/docs/React/Hooks/React-useImperativeHandle">React useImperativeHandle</Link> 文章。
        2022-10-16：新增 <Link to="/docs/React/Hooks/React-useLayoutEffect">React useLayoutEffect</Link> 文章。
        2022-10-15：新增 <Link to="/docs/React/Package/React-RTK-Query">React 使用 RTK Query 來獲取 API 資料</Link> 文章。
        2022-10-14：新增 <Link to="/docs/React/Package/React-Icons">React Icons</Link> 文章。
        2022-10-12：新增 <Link to="/docs/JavaScript/intersectionObserver">使用 Intersection Observer API 實作 Infinite Scroll 與 Lazy Loading</Link> 文章。
        2022-10-10：新增 <Link to="/docs/Others/figmaShortcut">Figma 常用快捷鍵</Link> 文章。
        2022-10-10：新增 <Link to="/docs/VS%20Code/vsCodeDebug">使用 VS Code 進行 Debug (JavaScript)</Link> 文章。
        2022-10-10：新增 <Link to="/docs/CSS/scrollerBar">調整 Scroller Bar 的樣式</Link> 文章。
        2022-10-10：新增 <Link to="/docs/CSS/smoothScroll">使用 Smooth 來讓滾動軸更滑順</Link> 文章。
        2022-10-10：新增 <Link to="/docs/CSS/columns">使用 Columns 調整電腦與手機的網頁畫面</Link> 文章。
        2022-10-09：新增 <Link to="/docs/React/Package/React-Google-Auth">React 使用 Google 帳號登入網站</Link> 文章。
        2022-10-09：新增 <Link to="/docs/React/Package/React-Protected-Routes">React Protected Routes</Link> 文章。
        2022-10-07：新增 <Link to="/docs/React/Tips/React-Optional-Chaining">React 常用的 JavaScript 語法 - 可選鏈</Link> 文章。
        2022-10-07：新增 <Link to="/docs/React/Tips/React-Objects">React 常用的 JavaScript 語法 - 物件</Link> 文章。
        2022-10-06：新增 <Link to="/docs/React/Tips/React-Ternary-Operators">React 常用的 JavaScript 語法 - 三元運算子</Link> 文章。
        2022-10-06：新增 <Link to="/docs/React/Tips/React-Template-String">React 常用的 JavaScript 語法 - 樣板字串</Link> 文章。
        2022-10-06：新增 <Link to="/docs/React/Tips/React-Arrow-Function">React 常用的 JavaScript 語法 - 箭頭函式</Link> 文章。
        2022-10-05：新增 <Link to="/docs/React/Hooks/React-useRef">React useRef</Link> 文章，修改 Redux Toolit 文章的內容。
    `
        .trim()
        .split("\n");

    const allLogs = rawLogs.map((log) => parseLogEntry(log.trim()));

    // Group logs by year and month
    const groupedLogs = allLogs.reduce((acc, log) => {
        const [year, month] = log.date.split("-");
        const key = `${year}-${month}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(log);
        return acc;
    }, {});

    // Setup infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleItems < Object.keys(groupedLogs).length) {
                    setVisibleItems((prev) => prev + ITEMS_PER_PAGE);
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [visibleItems, groupedLogs]);

    // Handle scroll to top visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="p-6 mx-auto w-full bg-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-20 pb-4 mb-2 backdrop-blur-sm bg-gray-900/95">
                <h2 className="flex gap-3 items-center text-2xl font-bold text-blue-400">
                    <CalendarDays className="w-6 h-6" />
                    更新紀錄
                </h2>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
                {Object.entries(groupedLogs)
                    .slice(0, visibleItems)
                    .map(([yearMonth, logs], groupIndex) => {
                        const [year, month] = yearMonth.split("-");
                        return (
                            <div
                                key={yearMonth}
                                className="relative"
                                style={{
                                    animation: `fadeIn 0.5s ease-out ${groupIndex * 0.1}s both`,
                                }}
                            >
                                {/* Month Header */}
                                <div className="flex sticky top-20 z-10 py-2 mb-6 backdrop-blur-sm bg-gray-900/95">
                                    <div className="flex gap-2">
                                        <Clock className="flex-shrink-0 w-5 h-5 text-blue-400" />
                                        <h3 className="flex text-xl font-semibold leading-none text-blue-400">
                                            {year}年 {month}月
                                        </h3>
                                    </div>
                                </div>

                                {/* Timeline Items */}
                                <div className="space-y-6">
                                    {logs.map((log, index) => (
                                        <div
                                            key={index}
                                            className="relative pl-8 group"
                                            style={{
                                                animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                                            }}
                                        >
                                            {/* Timeline dot and line */}
                                            <div className="absolute top-0 left-0 h-full">
                                                <div className="absolute top-[22px] left-[7px] w-px h-full bg-gray-700 group-last:hidden"></div>
                                                <div className="absolute top-[14px] left-0 w-3.5 h-3.5 bg-gray-800 border-2 border-blue-400 rounded-full transition-all duration-300 group-hover:scale-125 group-hover:border-blue-300"></div>
                                            </div>

                                            {/* Content Card */}
                                            <a href={log.link} className="block group/link">
                                                <time className="block mb-1 text-sm text-gray-400">
                                                    {new Date(log.date).toLocaleDateString("zh-TW")}
                                                </time>
                                                <div className="p-4 rounded-lg transition-all duration-300 transform bg-gray-800/50 hover:bg-gray-800 group-hover/link:translate-x-2 group-hover/link:shadow-lg group-hover/link:shadow-blue-500/10">
                                                    <span className="text-gray-100 transition-colors duration-300 group-hover/link:text-blue-300">
                                                        {log.title}
                                                    </span>
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="h-10" />

            {/* Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default TimelineLogs;
