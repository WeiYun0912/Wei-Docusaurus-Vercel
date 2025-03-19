---
title: "[vue] Vue3 Teleport 讓 Modal、Tooltip 正確顯示"

keywords: [Vue3, Teleport, Modal, Tooltip, Dialog]

description: "Vue 3 的 Teleport 讓 Modal、Tooltip 能渲染到 body，避免 z-index、overflow: hidden 問題，並透過程式碼比較用與不用的差異。"

author: WeiYun0912

og:title: "[Vue 3] Teleport 讓 Modal、Tooltip 正確顯示"

og:description: "Vue 3 的 Teleport 讓 Modal、Tooltip 能渲染到 body，避免 z-index、overflow: hidden 問題，並透過程式碼比較用與不用的差異。"

sidebar_position: 10
---

import Giscus from "@site/src/components/GiscusComponent"

# Vue3 Teleport 讓 Modal、Tooltip 正確顯示

## 簡介

Vue 3 提供的 Teleport 允許我們將元件渲染到指定的 DOM 節點，即使該元件位於 Vue 元件樹的深處。

解決的問題：

-   解決 z-index 問題：Modal、Tooltip 可能會被 z-index 蓋住，層級錯誤的問題。
-   避免 overflow: hidden 限制：如果 Modal 放在 position: relative 或 overflow: hidden 的父層，會被裁切，導致無法正確顯示。
-   不影響 Vue 元件樹結構：Modal 還是屬於原本的 Vue 元件，但會在 body 下顯示，不會影響其他元件。

## 不使用 Teleport

如果 Modal 沒有用 Teleport，它可能會受到 overflow: hidden 、 z-index 、 position 等限制，導致 UI 錯誤。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import NestedComponent from "./components/NestedComponents.vue";
</script>
<template>
    <div class="app">
        <h1>Vue 3 Modal (不使用 Teleport)</h1>

        <div class="container">
            <NestedComponent />
        </div>
    </div>
</template>
```

```html title="NestedComponent.vue" showLineNumbers
<script setup>
    import { ref } from "vue";

    const showModal = ref(false);
</script>
<template>
    <div class="nested-component">
        <h2>Nested Component</h2>
        <p>這個元件包含一個會有樣式和 z-index 問題的視窗。</p>

        <button @click="showModal = true" class="open-button">開啟視窗</button>

        <!-- 不使用 Teleport -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>Modal Title</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus deleniti laboriosam tempora
                    debitis minima molestiae aspernatur placeat a, quibusdam odio! Quis perferendis alias recusandae
                    eius consequuntur ea dolor repudiandae voluptate.
                </p>
                <ul>
                    <li>Hello World</li>
                </ul>
                <div class="modal-footer">
                    <button @click="showModal = false" class="close-button">Close Modal</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    .nested-component {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 5px;
        position: relative; /* 這會影響 Modal 的定位 */
    }

    .open-button,
    .close-button {
        background-color: #4caf50;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .close-button {
        background-color: #f44336;
    }

    /* Modal 樣式 */
    .modal {
        position: absolute; /* 不是固定定位，所以它是相對於最近的定位祖先 */
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        /* Note: z-index 可能不會如預期運作 */
        z-index: 100;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        width: 80%;
        max-width: 500px;
        max-height: 80%;
        overflow-y: auto;
    }

    .modal-footer {
        margin-top: 20px;
        text-align: right;
    }
</style>
```

現在直接點擊按鈕，Modal 會無法正確顯示，正確的 Modal 應該是要在 body 下顯示，也就是最外層。

![Image](https://i.imgur.com/FoWdeul.png)

![Image](https://i.imgur.com/HPgYz72.png)

## 使用 Teleport

使用 Teleport 可以解決上述問題，我們可以指定 Modal 要渲染到哪個 DOM 節點，這樣就不會受到 overflow: hidden 、 z-index 、 position 等限制。

<!-- prettier-ignore -->
```html title="NestedComponent.vue" showLineNumbers
<script setup>
import { ref } from "vue";

const showModal = ref(false);
</script>
<template>
    <div class="nested-component">
        <h2>Nested Component</h2>

        <button @click="showModal = true" class="open-button">開啟視窗</button>

        <!-- 使用 Teleport 將 modal 渲染在 body 底下 -->
        <Teleport to="body">
            <div v-if="showModal" class="modal">
                <div class="modal-content">
                    <h3>Modal Title</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus deleniti laboriosam tempora
                        debitis minima molestiae aspernatur placeat a, quibusdam odio! Quis perferendis alias recusandae
                        eius consequuntur ea dolor repudiandae voluptate.
                    </p>
                    <ul>
                        <li>Hello World</li>
                    </ul>
                    <div class="modal-footer">
                        <button @click="showModal = false" class="close-button">Close Modal</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style>
    ...
</style>
```

![Image](https://i.imgur.com/aBjYe5C.png)

![Image](https://i.imgur.com/J6xcfHT.png)

## 指定特定 DOM 節點

我們也可以指定特定 DOM 節點，但要先渲染目標容器，再渲染元件，這樣元件才會正確顯示。

:::warning 注意
如果沒有先渲染目標容器，再渲染元件，會有找不到目標節點的錯誤

(Uncaught (in promise) TypeError: Cannot read properties of null (reading 'nextSibling'))
:::

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { onMounted, ref } from "vue";
import NestedComponent from "./components/NestedComponents.vue";

const modalReady = ref(false);

onMounted(() => {
    // 確保在元件掛載後將 modalReady 設為 true
    modalReady.value = true;
});
</script>
<template>
    <div class="app">
        <h1>Vue 3 Modal (使用自定義 Teleport 目標)</h1>

        <!-- 首先渲染目標容器 -->
        <div class="container">
            <!-- 只有當 modalReady 為 true 時才渲染元件 -->
            <NestedComponent v-if="modalReady" />
        </div>
        <div id="custom-modal"></div>
    </div>
</template>
```

<!-- prettier-ignore -->
```html title="NestedComponent.vue" showLineNumbers
<script setup>
import { ref } from "vue";

const showModal = ref(false);
</script>
<template>
    <div class="nested-component">
        <h2>Nested Component</h2>

        <button @click="showModal = true" class="open-button">開啟視窗</button>

        <!-- 使用 Teleport 將 modal 渲染在 #custom-modal 底下 -->
        <Teleport to="#custom-modal">
            <div v-if="showModal" class="modal">
                <div class="modal-content">
                    <h3>Modal Title</h3>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus deleniti laboriosam tempora
                        debitis minima molestiae aspernatur placeat a, quibusdam odio! Quis perferendis alias recusandae
                        eius consequuntur ea dolor repudiandae voluptate.
                    </p>
                    <ul>
                        <li>Hello World</li>
                    </ul>
                    <div class="modal-footer">
                        <button @click="showModal = false" class="close-button">Close Modal</button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style>
    ...
</style>
```

![Image](https://i.imgur.com/3SDnbgk.png)

## 參考資料

[Vue 官方文件](https://cn.vuejs.org/guide/built-ins/teleport#basic-usage)

<Giscus />
