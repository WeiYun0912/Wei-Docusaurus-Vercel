---
title: "[vue] Vue :is 的常見用法"

keywords: [Vue3, 動態元件, :is, component, 動態標籤]

description: "透過 Vue 的 :is 屬性，讓元件可以根據不同的需求切換標籤或元件，提高靈活性與可重用性。"

author: WeiYun0912

og:title: "[vue] Vue :is 的常見用法"

og:description: "透過 Vue 的 :is 屬性，讓元件可以根據不同的需求切換標籤或元件，提高靈活性與可重用性。"

sidebar_position: 6
---

import Giscus from "@site/src/components/GiscusComponent"

# Vue `:is` 的常見用法

## **簡介**

在 Vue 3 中，`:is` 是一個特殊的屬性，允許我們根據變數來 **動態切換標籤或元件**，這對於需要在相同位置顯示不同內容的情境特別有用。

適用場景:

-   **根據條件動態切換 HTML 標籤**（例如 `h1`、`h2` 等）
-   **動態渲染不同的 Vue 元件**
-   **與 `keep-alive` 搭配使用，讓元件在切換時保留狀態**

`:is` 屬性可以直接用在 **標籤（HTML）** 和 **元件（Component）**，接下來我們會介紹幾種常見的使用方式。

## **動態切換 HTML 標籤**

有時我們需要根據某個條件來 **動態變更標題的標籤（`h1`、`h2` 等）**，這時可以使用 `:is` 來實現。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";
const headingTag = ref("h1");
</script>

<template>
    <div>
        <label>
            選擇標題標籤：
            <select v-model="headingTag">
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
            </select>
        </label>

        <!-- 使用 :is 動態變更標籤 -->
        <component :is="headingTag">這是一個動態標題</component>
    </div>
</template>
```

**解釋：**

-   `component` 標籤搭配 `:is="headingTag"`，可以根據 `headingTag` 的值來變換標籤。
-   當 `headingTag` 變更時，對應的 HTML 標籤會即時切換。

---

## **動態渲染 Vue 元件**

如果有多個 Vue 元件，我們可以使用 `:is` 來動態渲染不同的元件，而不需要手動使用 `v-if` 來切換。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { shallowRef } from "vue";
import ComponentA from "./components/ComponentA.vue";
import ComponentB from "./components/ComponentB.vue";
const currentComponent = shallowRef(ComponentA);

const toggleTab = () => {
    currentComponent.value = currentComponent.value == ComponentA ? ComponentB : ComponentA;
};
</script>
<template>
    <div>
        <component :is="currentComponent" />
        <button @click="toggleTab">切換</button>
    </div>
</template>
```

**解釋：**

-   `:is` 屬性可接受 **已註冊的元件**，根據 `currentComponent` 的值來動態渲染。
-   點擊按鈕時，`currentComponent` 會變更，頁面上會即時顯示對應的元件。

---

## **結合 `keep-alive` 提升效能**

當我們頻繁切換 Vue 元件時，Vue 會 **銷毀和重新掛載** 這些元件，這可能會造成效能問題。如果我們希望 **切換時保留元件的狀態**，可以搭配 `keep-alive` 使用。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<template>
    <keep-alive>
        <component :is="currentComponent" />
    </keep-alive>
</template>
```

**效果：**

-   被 `keep-alive` 包裹的元件 **不會被銷毀**，只會 **切換顯示與隱藏**。
-   適合用於 **分頁、標籤切換、步驟流程** 等場景。

---

## **`v-if` vs. `:is` vs. `v-show`**

|              | `v-if`                     | `:is` + `component`                | `v-show`                      |
| ------------ | -------------------------- | ---------------------------------- | ----------------------------- |
| **用途**     | 條件判斷時渲染或移除 DOM   | 動態變更標籤或元件                 | 透過 `display: none` 控制顯示 |
| **執行時機** | 符合條件時 **掛載/卸載**   | **根據變數** 切換不同的標籤或元件  | **不影響 DOM 結構**           |
| **效能影響** | **切換時有銷毀與重建成本** | **動態切換但可與 keep-alive 搭配** | **切換時效能較佳**            |

---

## **小小小總結**

-   `:is` 讓我們可以動態切換 HTML 標籤或 Vue 元件，提高靈活性。
-   `:is` 搭配 `<component>` 可用於 **動態顯示元件**，適合 **多種 UI 切換場景**。
-   `keep-alive` 可與 `:is` 結合，讓 Vue **保留元件狀態**，提升效能。
-   在某些情境下，`v-if`、`v-show` 也能達成類似效果，需根據需求選擇適當的解決方案。

<Giscus />
