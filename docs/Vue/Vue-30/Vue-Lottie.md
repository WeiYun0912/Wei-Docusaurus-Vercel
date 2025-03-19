---
title: "[vue] Vue 使用 Lottie 動畫"

keywords: [vue3, lottie]

description: Vue 使用 Lottie 動畫 。

author: WeiYun0912

og:title: "[vue, lottie] Vue 使用 Lottie 動畫"

og:description: "Vue 使用 Lottie 動畫"

sidebar_position: 15
---

import Giscus from "@site/src/components/GiscusComponent"

# Vue 使用 Lottie 動畫

## 簡介

[Lottie](https://lottiefiles.com/) 是一個用於在網頁上顯示 UI 動畫的 JavaScript Library，我們可以在 HTML 中嵌入 JSON 格式的動畫數據，並通過 JavaScript 控制動畫的播放、暫停、停止等操作。

[LottieFiles](https://lottiefiles.com/featured-free-animations) 這個網站提供了很多免費的 Lottie 動畫，我們可以選擇喜歡的動畫，並下載 JSON 格式的動畫數據，要是不滿意某些動畫，也可以利用 Lottie 的線上編輯器修改動畫，或是自己建立動畫。

## Lottie 的優勢

-   **體積小**：比 GIF 小 90%（因為 JSON 只是描述動畫，而不是儲存像素）
-   **支援互動**：可以控制播放、暫停、進度
-   **效能更好**：GIF 會佔用大量 CPU，而 Lottie 是向量動畫，效能較好
-   **支援透明背景**：不像 MP4 需要 webm 才能有透明效果

## Lottie 的核心技術

Lottie 的核心是 **Bodymovin**，這是一個 After Effects 插件，它可以：

-   將動畫輸出為 JSON 格式
-   前端透過 lottie-web 解析 JSON，渲染成 SVG 或 Canvas
-   讓動畫可以動態控制（開始、暫停、加速、倒放等）

## Lottie 與 GIF 比較

| 比較項目 | Lottie（JSON）            | GIF                   |
| -------- | ------------------------- | --------------------- |
| 檔案大小 | 小 90%（JSON 格式）       | 大（每幀都是圖片）    |
| 解析度   | 無限縮放不失真            | 放大會模糊            |
| 透明背景 | 支援                      | 不支援（只能用 webp） |
| 互動性   | 可程式化控制              | 只能播放 / 停止       |
| 效能     | 基於 SVG/Canvas，較省資源 | 會佔用大量 CPU        |

## 使用

我們可以直接安裝別人寫好的套件，這邊我們使用 `vue3-lottie` 這個套件，它是一個 Vue 的套件，可以讓我們在 Vue 中使用 Lottie 動畫，很多功能都有，像是動畫的播放、暫停、停止、循環、倒放、加速、減速等。

```bash
npm install vue3-lottie
```

## 下載 Lottie 動畫

這邊我們使用 [LottieFiles](https://lottiefiles.com/featured-free-animations) 這個網站，搜尋 `loading` 的動畫，找到喜歡的動畫，並下載 JSON 格式的動畫數據。

![Image](https://i.imgur.com/UbjskN5.png)

點進來以後按下 `Download` 按鈕

![Image](https://i.imgur.com/WcJIJX0.png)

接著會跳出一個視窗，要你選擇要放到哪個資料夾，點擊底下的 New project/folder 命名你的資料夾名稱，接著按下 `Save` 按鈕。

![Image](https://i.imgur.com/hbkWjw9.png)

然後畫面就會被帶到這個動畫的編輯頁面，如果你沒有要編輯這個動畫的話，可以直接點右邊的 `Lottie JSON` 按鈕，就可以下載 JSON 格式的動畫數據。

![Image](https://i.imgur.com/EYyPDjG.png)

這邊要注意的是，一旦我們點了剛剛的 `Download` 按鈕，這個動畫就會被加入到我們的專案中，而在[免費](https://help.lottiefiles.com/hc/en-us/articles/16240626895385-Update-on-Upload-Limits-in-Free-Workspace)的 workspace 額度中，`我們只能有 10 個動畫`，這個資訊可以在 Lottie 的 Dashboard 看到，所以如果我們想要下載更多的動畫，就需要升級到付費的方案。

![Image](https://i.imgur.com/RHNKVaB.png)

如果你的這個 workspace 已經滿額度了，然後 workspace 下載的這些動畫你也用不到，就可以點 Workspace settings 進去，然後點擊 `Delete` 按鈕，就可以刪除這個 workspace。

![Image](https://i.imgur.com/KLzflVL.png)

## 使用

現在先把剛剛下載的 json 檔案放在 `assets/lottie/` 資料夾下，接著我們就可以開始使用這個動畫了。

![Image](https://i.imgur.com/AcyMV1O.png)

### main.js

先在 main.js 引入 `vue3-lottie` 套件，並且註冊成全域的元件。

```javascript
import { createApp } from "vue";
import App from "./App.vue";
import Vue3Lottie from "vue3-lottie";

createApp(App).use(Vue3Lottie).mount("#app");
```

### 基本用法

在 `App.vue` 中使用 `Lottie` 元件，並且傳入動畫的 JSON 資料。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import loadingData from "./assets/lottie/loading.json"; // 你的 Lottie JSON 檔案
</script>

<template>
    <Vue3Lottie :animationData="loadingData" />
</template>
```

![Image](https://i.imgur.com/pmZfjLj.png)

### 控制動畫

我們可以透過 `Lottie` 元件的 `play`、`pause`、`stop` 等方法來控制動畫的播放、暫停、停止等操作。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";
import loadingData from "./assets/lottie/loading.json";

const lottieRef = ref(null);
const isPlaying = ref(true);

const toggleAnimation = () => {
    isPlaying.value = !isPlaying.value;
    isPlaying.value ? lottieRef.value.play() : lottieRef.value.pause();
};
</script>

<template>
    <Vue3Lottie ref="lottieRef" :animationData="loadingData" />
    <button @click="toggleAnimation">
        {{ isPlaying ? "暫停動畫" : "播放動畫" }}
    </button>
</template>
```

其他還有很多參數，有興趣的可以到 [官方文件](https://vue3-lottie.vercel.app/api/props) 查看。

## 參考資料

-   [LottieFiles](https://lottiefiles.com/featured-free-animations)
-   [Lottie](https://lottiefiles.com/)
-   [vue3-lottie](https://github.com/megasanjay/vue3-lottie)

<Giscus />
