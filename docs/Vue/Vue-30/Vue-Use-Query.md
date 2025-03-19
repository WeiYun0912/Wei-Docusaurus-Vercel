---
title: "[vue] Vue Query 介紹： 使用 useQuery 來管理 API 資料"

keywords: [Vue3, tanstack, useQuery]

description: "useQuery 是 Vue Query 提供的 Hook，可用來自動管理 API 資料的取得與狀態"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹： 使用 useQuery 來管理 API 資料"

og:description: "useQuery 是 Vue Query 提供的 Hook，可用來自動管理 API 資料的取得與狀態"

sidebar_position: 20
---

import Giscus from "@site/src/components/GiscusComponent"

# Vue Query 使用 useQuery 來管理 API 資料

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## 簡介

在開發 Vue 應用時，傳統的發 API 方式通常是：

1. 使用 `axios` 或 `fetch` 來發送 API 請求。
2. 手動設定 `loading` 狀態，以便 UI 反映當前的請求狀態。
3. 監聽 API 的錯誤與成功結果，並根據情況進行適當處理。
4. 儲存 API 回傳的資料到 `ref()` 或 `reactive()`，確保 Vue 能夠響應式更新畫面。
5. 若多個元件需要相同的 API 資料，則必須自行實作 **快取** 或 **避免重複請求**。

這樣的流程較為繁瑣，並且容易導致：

-   **請求狀態管理複雜**：每次發送 API 時，都需要追蹤 `loading`、`error`、`success` 狀態。
-   **快取與同步問題**：如果多個元件需要相同的 API 資料，開發者需要額外處理快取機制。
-   **效能影響**：當 API 被頻繁請求時，可能會造成不必要的網路負擔。

這時候，Vue Query 提供的 `useQuery` 就能大幅簡化這些問題！

## 安裝

我們通常會使用 `axios` 來發送 API 請求，所以這邊會順便安裝 `axios` 和 `@tanstack/vue-query`。

```bash
npm install axios @tanstack/vue-query
```

安裝完之後需要在 `main.js` 中 use `VueQueryPlugin`。

```js title='main.js' showLineNumbers
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { VueQueryPlugin } from "@tanstack/vue-query";

createApp(App).use(VueQueryPlugin).mount("#app");
```

## 什麼是 useQuery？

`useQuery` 是 Vue Query 提供的一個 **Hook**，它能夠輕鬆管理 API 資料的請求、狀態與快取。透過 `useQuery`，我們可以：

-   **簡單發送 API 請求**，並管理 `loading`、`error`、`data` 狀態。
-   **自動快取 API 回應**，減少不必要的重複請求。
-   **當畫面重新載入時自動重新請求資料**。
-   **內建錯誤處理與重試機制**，避免因臨時性錯誤導致應用崩潰。

## 為什麼要使用 useQuery？

### **不用 useQuery（傳統方式）**

可以看到以下程式碼需要自己手動管理 `loading`、`error` 狀態，如果今天有多個 API 需要管理，會變得很麻煩。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const todos = ref([]);
const isLoading = ref(true);
const isError = ref(false);

const fetchTodos = async () => {
    try {
        isLoading.value = true;
        const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");
        todos.value = data;
    } catch (error) {
        isError.value = true;
    } finally {
        isLoading.value = false;
    }
};

onMounted(fetchTodos);
</script>

<template>
    <div>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError">取得資料失敗</p>
        <ul v-else>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

### **使用 useQuery**

改成使用 `useQuery` 來管理 API 資料後，可以看到程式碼變得非常簡潔，而且不需要自己手動管理 `loading`、`error` 狀態，都可以從 `useQuery` 的解構取得。

要注意的是，使用 `useQuery` 時，需要傳入 `queryKey` 和 `queryFn`，`queryKey` 是這個查詢的識別符，`queryFn` 是這個查詢的函式。

-   `queryKey`：這是用來識別 API 查詢的唯一 Key，Vue Query 會根據它來做快取。
-   `queryFn`：這是負責執行 API 請求的函式，Vue Query 會根據 queryKey 來決定是否執行這個函式。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");
    return data;
};

const {
    data: todos, // 這裡的 data 就是 fetchTodos 的回傳值
    isLoading,
    isError,
} = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
});
</script>

<template>
    <div>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError">取得資料失敗</p>
        <ul v-else>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

| 傳統 API 處理             | Vue Query                        |
| ------------------------- | -------------------------------- |
| 需要手動管理 loading 狀態 | 內建 isLoading 狀態              |
| 需要手動捕捉錯誤          | 內建 isError 狀態                |
| 需要手動處理快取          | 自動快取 API 回應                |
| 無法自動重新同步          | 當頁面重新聚焦時，會自動更新資料 |

## 參考資料

-   [Vue Query 官方文件](https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery)

<Giscus />
