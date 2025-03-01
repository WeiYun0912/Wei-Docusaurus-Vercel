---
title: "[vue] VueUse 介紹"

keywords: [vue3, vueuse]

description: vueuse 是一個針對 Vue 3 Composition API 的實用函式庫，提供了 200+ 個 Hooks，讓我們更簡單地處理 狀態管理、事件監聽、計時器、瀏覽器 API 等，非常豐富。

author: WeiYun0912

og:title: "[vue, vueuse] VueUse 介紹"

og:description: "vueuse 是一個針對 Vue 3 Composition API 的實用函式庫，提供了 200+ 個 Hooks，讓我們更簡單地處理 狀態管理、事件監聽、計時器、瀏覽器 API 等，非常豐富。"
---

# VueUse

## 簡介

[VueUse](https://vueuse.org/guide/) 是一個針對 Vue 3 Composition API 的實用函式庫，提供了 200+ 個 Hooks，讓我們更簡單地處理 狀態管理、事件監聽、計時器、瀏覽器 API 等，非常豐富。

要使用 VueUse，我們需要先安裝它：

```bash
npm install @vueuse/core @vueuse/components
```

## 使用

VueUse 的用法非常簡單，我們只需要 import 我們需要的 Hooks 就可以使用了，這邊就簡單介紹幾個我工作中常用的 Hooks。

### useClipboard & UseClipboard Component

[useClipboard](https://vueuse.org/core/useClipboard/) 是一個用於剪貼的 Hook，可以讓我們很方便地複製文字。

雖然瀏覽器也有 `navigator.clipboard` 可以複製文字，但 `useClipboard` 更適合在 Vue 中使用，因為它會自動更新 `text` 的值，並且在 `copied` 為 `true` 時，會自動設置為 `false`，可以很方便的做 UI 的變化。

```javascript
<script setup>
import { ref } from "vue";
import { useClipboard } from "@vueuse/core";

const source = ref("Hello, VueUse!");
const { text, copy, copied, isSupported } = useClipboard({ source });
</script>

<template>
    <div v-if="isSupported">
        <button @click="copy()">
            <span v-if="!copied">Copy</span>
            <span v-else>Copied!</span>
        </button>
        <p>
            Current copied: <code>{{ text || "none" }}</code>
        </p>
    </div>
    <p v-else>你的瀏覽器不支援剪貼簿功能</p>
</template>
```

`useClipboard` 也有提供一個 `UseClipboard` 的 Component，要是不需要使用 `useClipboard` 的 Hook，可以直接使用 `UseClipboard` 的 Component。

```javascript
<template>
  <UseClipboard v-slot="{ copy, copied }" source="VueUse 很好用！">
    <button @click="copy()">
      {{ copied ? "Copied" : "Copy" }}
    </button>
  </UseClipboard>
</template>
```

| 功能         | useClipboard() | `<UseClipboard>` |
| ------------ | -------------- | ---------------- |
| 靈活度高     | ✅             | ❌               |
| 適合多個按鈕 | ✅             | ❌               |
| 語法簡潔     | ❌             | ✅               |
| 適合簡單場景 | ❌             | ✅               |

### useLocalStorage

[useLocalStorage](https://vueuse.org/core/useLocalStorage/) 是 VueUse 提供的一個 本地儲存（LocalStorage）管理 Hook，可以：

-   讓數據自動存入 localStorage，並在頁面刷新後保留
-   響應式綁定 localStorage 值，不需要手動 setItem() 超方便
-   類似 ref()，可直接讀取 & 修改數據
-   儲存 json 物件的時候不需要 `JSON.stringify` 和 `JSON.parse`，可以直接將物件賦值給 `useLocalStorage` 的 `value`

theme 會自動同步到 localStorage，重新整理頁面後，theme 仍會保持上次的值，重點是還可以自動同步到其他頁面 (storage 的 event)。

現在你可以開兩個頁面，看看 theme 的值是否會同步，在 A 頁面切換主題，在 B 頁面也會同步。

```javascript
<script setup>
import { useLocalStorage } from "@vueuse/core";

// 使用 localStorage 儲存主題模式，預設為 "light"
const theme = useLocalStorage("theme", "light");

// 切換深色模式
const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
};

const clearLocalStorage = () => {
    theme.value = null;
};
</script>

<template>
    <p>目前主題模式：{{ theme }}</p>
    <button @click="toggleTheme">切換主題</button>
    <button @click="clearLocalStorage">清除 localStorage</button>
</template>
```

| 功能          | useLocalStorage                  | localStorage                                          |
| ------------- | -------------------------------- | ----------------------------------------------------- |
| 語法簡潔      | ✅ useLocalStorage("key", value) | ❌ localStorage.setItem("key", JSON.stringify(value)) |
| 響應式更新    | ✅ ref() 綁定，UI 會自動更新     | ❌ 需要 watch 手動監聽                                |
| JSON 自動處理 | ✅ 內建轉換                      | ❌ 需要 JSON.stringify() / JSON.parse()               |
| 跨分頁同步    | ✅ 建支援                        | ❌ 需要 window.addEventListener("storage", ...)       |

### useDebounceFn

[useDebounceFn](https://vueuse.org/core/useDebounceFn/) 是 VueUse 提供的一個防抖函式，可以讓我們很方便的進行防抖，不用使用 `setTimeout` 來實作。

```javascript
<script setup>
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";

const searchQuery = ref("");
const results = ref([]);

// 假設這是你的 API 請求函數
const fetchResults = async () => {
    console.log("發送 API 請求:", searchQuery.value);
    // 模擬 API 請求
    results.value = [`結果：${searchQuery.value}`];
};

// 只有 500ms 內沒有再輸入時，才發送 API
const debouncedFetch = useDebounceFn(fetchResults, 500);

// 監聽 searchQuery 變化，自動執行防抖請求
watch(searchQuery, () => {
    debouncedFetch();
});
</script>

<template>
    <input v-model="searchQuery" placeholder="輸入關鍵字搜尋" />
    <ul>
        <li v-for="(item, index) in results" :key="index">{{ item }}</li>
    </ul>
</template>
```

### useWindowSize

[useWindowSize](https://vueuse.org/core/useWindowSize/) 是 VueUse 提供的一個監聽視窗大小的 Hook，可以讓我們很方便的監聽視窗大小的變化。

```javascript
<script setup>
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import { UseWindowSize } from "@vueuse/components";
const { width } = useWindowSize();

// 根據視窗寬度切換模式
const isMobile = computed(() => width.value < 768);
</script>

<template>
    <p v-if="isMobile">目前是手機模式 📱</p>
    <p v-else>目前是桌面模式 💻</p>
    <!-- 或是 -->
    <UseWindowSize v-slot="{ width }">
        <p v-if="width < 768">目前是手機模式 📱</p>
        <p v-else>目前是桌面模式 💻</p>
    </UseWindowSize>
</template>
```

## 參考資料

-   [VueUse 官方文件](https://vueuse.org/guide/)
-   [VueUse 官方 GitHub](https://github.com/vueuse/vueuse)
-   [VueUse 原碼](https://github.com/vueuse/vueuse/tree/main/packages/core)
