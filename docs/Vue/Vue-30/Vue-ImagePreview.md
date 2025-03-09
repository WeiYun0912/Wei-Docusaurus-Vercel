---
title: "[Vue] 使用 vue-easy-lightbox 實現圖片預覽"

keywords: [Vue3, vue-easy-lightbox, 圖片預覽]

description: "使用 vue-easy-lightbox 實現圖片預覽，支援放大、縮小、旋轉、恢復原始大小，也可以左右切換圖片。"

author: WeiYun0912

og:title: "[Vue] 使用 vue-easy-lightbox 實現圖片預覽"

og:description: "使用 vue-easy-lightbox 實現圖片預覽，支援放大、縮小、旋轉、恢復原始大小，也可以左右切換圖片。"
---

# 使用 vue-easy-lightbox 實現圖片預覽

## 前言

在 Vue 3 應用中，我們可能需要預覽不同類型的圖檔，例如：

-   JPG
-   PNG
-   GIF
-   SVG

這時候可以使用：

-   [vue-easy-lightbox](https://github.com/XiongAmao/vue-easy-lightbox) 支援圖片預覽

## 安裝

```bash
npm install vue-easy-lightbox
```

## vue-easy-lightbox

使用的方式很簡單，只要引入 `VueEasyLightbox` 即可。

接著在 `imgs props` 的地方提供圖片的 `url`，可以提供陣列或單一個 `url`，然後我們可以簡單給一個開啟按鈕，當點擊按鈕時，就會開啟圖片預覽。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";

// 圖片陣列（可支援多張圖片）
const imageList = ref(["https://i.imgur.com/376RZas.png", "https://i.imgur.com/xLqGdL3.jpg"]);

// 控制燈箱開關
const dialog = ref(false);

const openPreview = () => (dialog.value = true);
const closePreview = () => (dialog.value = false);
</script>

<template>
    <div>
        <!-- 預覽按鈕 -->
        <button @click="openPreview">預覽圖片</button>

        <vue-easy-lightbox :visible="dialog" :imgs="imageList" @hide="closePreview" />
    </div>
</template>
```

圖片預覽的時候也可以看到下方有幾個按鈕，可以放大、縮小、旋轉、恢復原始大小，也可以左右切換圖片。

![Image](https://i.imgur.com/mR4MFGa.png)

## toolbar

如果想要自訂 toolbar 的按鈕，可以透過 `#toolbar(v-slot:toolbar)` 來實現，但要注意的是，一旦使用 `v-slot:toolbar`，就會覆蓋掉原本的那些功能，所以需要自己重新實現和上樣式。

toolbarMethods 有提供以下方法：

-   `resize` 恢復原始大小
-   `rotate` 旋轉(預設 -90 度)
-   `rotateLeft` 往左旋轉
-   `rotateRight` 往右旋轉
-   `zoomIn` 放大
-   `zoomOut` 縮小

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";

// 圖片陣列（可支援多張圖片）
const imageList = ref(["https://i.imgur.com/376RZas.png", "https://i.imgur.com/xLqGdL3.jpg"]);

// 控制開關
const dialog = ref(false);

const openPreview = () => (dialog.value = true);
const closePreview = () => (dialog.value = false);
</script>

<template>
    <div>
        <!-- 預覽按鈕 -->
        <button @click="openPreview">預覽圖片</button>

        <vue-easy-lightbox :visible="dialog" :imgs="imageList" @hide="closePreview">
            <template #toolbar="{ toolbarMethods }">
                <button @click="toolbarMethods.zoomIn">放大</button>
                <button @click="toolbarMethods.zoomOut">縮小</button>
            </template>
        </vue-easy-lightbox>
    </div>
</template>

<style scoped>
button {
    padding: 8px 12px;
    margin: 10px;
    border: none;
    background-color: #3498db;
    color: white;
    border-radius: 4px;
}
</style>

```

![Image](https://i.imgur.com/jR6lhnf.png)

還有其他 props 可以設定，可以參考[官方文件](https://github.com/XiongAmao/vue-easy-lightbox?tab=readme-ov-file#options)。

## 參考資料

-   [vue-easy-lightbox](https://github.com/XiongAmao/vue-easy-lightbox)
