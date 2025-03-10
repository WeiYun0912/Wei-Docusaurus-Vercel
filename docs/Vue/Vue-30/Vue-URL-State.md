---
title: "[Vue] Vue 將 State 放入 URL 的好處與實作方式"

keywords: [Vue3, State, URL, Query Params, Vue Router, 狀態管理]

description: "在 Vue 項目中，將應用程式狀態（State）放入 URL，可以讓使用者直接分享當前狀態、支援瀏覽器返回功能、並減少 Vuex/Pinia 依賴。"

author: WeiYun0912

og:title: "[Vue] Vue 將 State 放入 URL 的好處與實作方式"

og:description: "在 Vue 項目中，將應用程式狀態（State）放入 URL，可以讓使用者直接分享當前狀態、支援瀏覽器返回功能、並減少 Vuex/Pinia 依賴。"
---

## 簡介

在 Vue 應用中，狀態管理通常由 `Pinia`、`Vuex` 或 `Composition API` 內的 `ref()`、`reactive()` 來管理。但在某些場景下，將 State 存入 URL 會更有優勢：

-   分享當前狀態
-   支援瀏覽器返回功能
-   減少 Vuex/Pinia 依賴

也就是說，如果今天在一個網頁需要分享某個頁面搜尋到的結果，如果今天我們將搜尋的結果放在 URL 上，這樣就可以直接分享給其他人，而且其他人也可以直接在 URL 上看到搜尋的結果。

| 項目                 | 傳統 State (Pinia/Vuex)           | URL Query Params                |
| -------------------- | --------------------------------- | ------------------------------- |
| 可分享性             | ❌ 狀態存在記憶體中，無法直接分享 | ✅ URL 可複製分享，還原相同狀態 |
| 支援瀏覽器前進/返回  | ❌ 需要手動處理                   | ✅ 瀏覽器按鍵可直接改變狀態     |
| SSR（伺服器端渲染）  | ❌ 須額外處理初始狀態             | ✅ 直接解析 URL 取得狀態        |
| 減少 Vuex/Pinia 依賴 | ❌ 需要全域狀態管理               | ✅ 不需額外狀態管理             |

## 實作

主要的核心作法其實就是把 `state` 轉換成 `query params` 的格式，然後程式在初始化時，會把 `query params` 轉換成 `state`，這樣就可以直接在 URL 上分享，而且也可以直接在 URL 上看到搜尋的結果。

這邊我們用 `vue-router` 的 `useRoute` 和 `useRouter` 來實作

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const searchQuery = ref(route.query.q || ""); // 從 URL 讀取初始值

// 更新 URL
const updateURL = () => {
    router.push({ query: { q: searchQuery.value } });
};

// 監聽 URL 變更，自動更新 State
watch(
    () => route.query.q,
    (newQuery) => {
        searchQuery.value = newQuery || "";
    }
);
</script>
<template>
    <div>
        <input v-model="searchQuery" placeholder="搜尋內容" />
        <button @click="updateURL">更新 URL</button>
        <p>當前搜尋：{{ searchQuery }}</p>
    </div>
</template>
```

現在只要我們在 URL 上輸入 `?q=Hello World`，就會自動把 `searchQuery` 的值設為 `Hello World`，這樣就可以直接在 URL 上分享，而且也可以直接在 URL 上看到搜尋的結果。

![Image](https://i.imgur.com/Ap0OTM4.png)

## 結合多個參數

如果今天我們需要結合多個參數，我們可以這樣做：

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const filters = ref({
    keyword: route.query.keyword || "",
    category: route.query.category || "",
});

// 更新 URL
const updateURL = () => {
    router.push({ query: { ...filters.value } });
};

// 監聽 URL 變更，自動更新 State
watch(
    () => route.query,
    (newQuery) => {
        filters.value = { ...filters.value, ...newQuery };
    }
);
</script>

<template>
    <div>
        <input v-model="filters.keyword" placeholder="關鍵字" />
        <select v-model="filters.category">
            <option value="">全部</option>
            <option value="tech">科技</option>
            <option value="news">新聞</option>
        </select>
        <button @click="updateURL">更新 URL</button>
        <p>當前條件：{{ filters }}</p>
    </div>
</template>
```

當需要動態更新 URL 但不希望產生瀏覽器歷史紀錄，可以用 `router.replace()` 而非 `router.push()`，這樣按下瀏覽器的上一頁或下一頁時，就不會回到上一個狀態。

```js
router.replace({ query: { keyword: searchQuery.value } });
```

## 總結

| 項目                 | 傳統 State (Pinia/Vuex)             |
| -------------------- | ----------------------------------- |
| 即時搜尋             | ✅ query params，replace() 更新 URL |
| 篩選條件             | ✅ query params，可分享 URL         |
| 分頁                 | ✅ query params，page=1             |
| 應用模式（深色模式） | ✅ query params 或 localStorage     |
