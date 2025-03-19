---
title: "[vue] Vue Query 介紹：錯誤處理與重試機制 (Error & Retry)"

keywords: [Vue3, tanstack, useQuery, useMutation, onError, retry, 錯誤處理]

description: "介紹 Vue Query 的 onError 與 retry 機制，幫助我們處理 API 錯誤與重試，提高應用穩定性與使用者體驗。"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹：錯誤處理與重試機制 (Error & Retry)"

og:description: "介紹 Vue Query 的 onError 與 retry 機制，幫助我們處理 API 錯誤與重試，提高應用穩定性與使用者體驗。"

sidebar_position: 21
---

# Vue Query 介紹：錯誤處理與重試機制 (Error & Retry)

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## 簡介

在前端開發中，API 請求可能會因為 伺服器錯誤 (500)、網路斷線 (Network Error) 或`請求超時`而失敗。如果沒有妥善處理：

-   使用者體驗會很糟糕：無限轉圈圈、沒有回應、白屏
-   不必要的 API 請求：可能導致 API 過載
-   數據不一致：例如，樂觀更新後 API 失敗，畫面上卻已經顯示變更

Vue Query 提供 `onError` 與 `retry` 機制，幫助我們處理 API 錯誤與重試，提高應用穩定性與使用者體驗。

## 不做任何處理

這邊我們故意把 API 弄錯，讓它回傳 404 錯誤，我的 json-server 設定是 `http://localhost:3002/todos`，故意打錯成 `http://localhost:3002/todos_HelloWorld`，所以一定會回傳 404 錯誤。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:3002/todos_HelloWorld");
    return data;
};

const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
});
</script>

<template>
    <div>
        <h2>待辦事項</h2>
        <p v-if="isLoading">載入中...</p>
        <ul v-else>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

當 API 回傳錯誤時，`Vue Query` 預設會重試 `3 次`，所以可以看到我們發了 `3 次 API 請求`，但都沒有錯誤處理，所以會一直卡在 `載入中` 的狀態。

![Image](https://i.imgur.com/8ZLOs8f.png)

然後第 `4 次` 還是錯誤的話，就會`停止重試，並拋出錯誤`，但我們現在還沒有處理錯誤，所以不會看到錯誤訊息。

![Image](https://i.imgur.com/TQ7M1GG.png)

## 使用 onError

我們可以解構 `useQuery` 的 `isError` 和 `error` 來顯示錯誤訊息給使用者，然後在 `useQuery` 的 `onError` 中使用 `console.error` 來印出錯誤訊息。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:3002/todos_HelloWorld");
    return data;
};

const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    onError: (error) => {
        console.error("API 請求失敗:", error.message);
    },
});
</script>

<template>
    <div>
        <h2>待辦事項</h2>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError" style="color: red">❌ 請求失敗: {{ error.message }}</p>
        <ul v-else>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

![Image](https://i.imgur.com/qYeAsjz.png)

## 使用 retry

有時候 API 短暫失敗 (如網路問題)，不代表真正的錯誤，所以我們可以讓 Vue Query 自動重試。

我們可以設定 `retry` 來控制重試次數，也可以設定 `retryDelay` 來控制重試的時間間隔。

-   `retry: 5` → 最多重試 5 次
-   `retry: false` → 不重試
-   `retryDelay: (failureCount, error) => {...}` → 根據錯誤類型決定是否重試

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:3002/todos_HelloWorld");
    return data;
};

const { data, isLoading, isError, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    retry: 5, // 最多重試 5 次
    retryDelay: (attempt, retryError) => {
        console.log("重試第", attempt, "次");
        console.log("錯誤訊息:", retryError);
        return attempt * 1000;
    }, // 第一次 1 秒，第二次 2 秒...
});
</script>

<template>
    <div>
        <h2>待辦事項</h2>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError" style="color: red">❌ 請求失敗: {{ error.message }}</p>
        <ul v-else>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

![Image](https://i.imgur.com/abWQd6W.png)

## 小小總結ㄉㄟ斯

-   API 可能失敗，`onError` 幫助我們顯示錯誤訊息，比較常見的做法是在 `onError` 的時候用一些元件顯示錯誤訊息，像是 `Toast` 或 `Alert`
-   `retry` 讓我們可以自動重試，避免短暫錯誤影響
