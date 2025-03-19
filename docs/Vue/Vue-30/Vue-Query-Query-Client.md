---
title: "[vue] Vue Query 介紹： 使用自訂 QueryClient 來管理快取與請求策略"

keywords: [Vue3, tanstack, useQuery, QueryClient, 自訂快取]

description: "透過 Vue Query 的自訂 QueryClient，可靈活管理 API 快取、請求策略。"

author: WeiYun0912

og:title: "[vue] 使用自訂 QueryClient 來管理快取與請求策略"

og:description: "透過 Vue Query 的自訂 QueryClient，可靈活管理 API 快取、請求策略。"

sidebar_position: 22
---

# 使用自訂 QueryClient 來管理快取與請求策略

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## 簡介

在 Vue Query 中，QueryClient 負責管理所有的查詢 (useQuery、useMutation 等)，並提供：

-   全域快取管理
-   請求重試 (retry)
-   自動背景同步 (refetch)
-   錯誤處理 (onError)
-   查詢生命週期管理

## 自訂 QueryClient

我們可以直接使用 `VueQueryPlugin` 來註冊 `QueryClient`，並設定全域選項。

這樣做的好處是：

-   統一管理 API 請求策略（如 staleTime、retry）
-   避免每個 useQuery 重複設定 retry 或 staleTime
-   可擴展性強，可根據應用需求調整 快取策略

```js title="main.js" showLineNumbers
// main.js
import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import App from "./App.vue";

// 建立 QueryClient，並設定全域選項
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60000, // 設定快取 60 秒內不會重新請求，也就是資料 60 秒內不會過期(fresh)
            retry: (failureCount, error) => {
                if (error.response?.status === 404) return false; // 404 不重試
                return failureCount < 3; // 其餘錯誤最多重試 3 次
            },
        },
    },
});

// 註冊 Vue Query Plugin
const app = createApp(App);
app.use(VueQueryPlugin, { queryClient });
app.mount("#app");
```

如果你只需要調整 `全域預設行為`，而不想自己建立 `QueryClient`，可以直接傳入 `QueryClientConfig`。

```js title="main.js" showLineNumbers
// main.js
import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";

const vueQueryPluginOptions = {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                staleTime: 3600000, // 1 小時內不會重新請求，也就是資料 1 小時內不會過期(fresh)
                refetchOnWindowFocus: false, // 預設不在視窗聚焦時重新請求
                retry: (failureCount, error) => {
                    if (error.response?.status === 404) return false; // 404 不重試
                    return failureCount < 3; // 其餘錯誤最多重試 3 次
                },
            },
        },
    },
};

const app = createApp(App);

app.use(VueQueryPlugin, vueQueryPluginOptions);
app.mount("#app");
```
