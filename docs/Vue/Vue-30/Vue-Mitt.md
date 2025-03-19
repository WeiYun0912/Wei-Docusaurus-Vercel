---
title: "[vue] Vue 使用 mitt 進行跨元件溝通"

keywords: [vue3, mitt]

description: Vue 使用 mitt 進行跨元件溝通 。

author: WeiYun0912

og:title: "[vue, mitt] Vue 使用 mitt 進行跨元件溝通"

og:description: "Vue 使用 mitt 進行跨元件溝通"

sidebar_position: 13
---

# Vue 使用 mitt 進行跨元件溝通

## 簡介

在 Vue 3 中，當我們需要在不同元件之間傳遞事件時，常見的做法有：

-   Props & Emit（適合父子元件）
-   Provide / Inject（適合祖孫元件）
-   Pinia / Vuex（適合全域狀態管理）
-   Event Bus（適合任意元件之間的溝通）

[mitt](https://github.com/developit/mitt) 是一個超輕量級的 Event Bus，可以在任何 JavaScript 環境中使用。

它可以讓 Vue 3 元件之間輕鬆溝通，但其實我們也可以直接使用 pinia 來達到全域溝通的效果。

如果你的事件 是即時的、一次性的，用 mitt。

如果你的數據 需要被保存，且影響應用狀態，用 Pinia。

簡單來區分就是 mitt 處理的是「發送事件」這個動作，而 Pinia 則負責「儲存狀態」，如果你的應用沒有即時需求，可能只用 Pinia 就夠了，不需要 mitt。

| 需求                       | 適合的方式 |
| -------------------------- | ---------- |
| 通知系統（Toast）          | mitt       |
| 開關 Modal / Drawer        | mitt       |
| 即時 WebSocket 訊息        | mitt       |
| 全域使用者資訊（userInfo） | Pinia      |
| 主題切換（Dark Mode）      | Pinia      |
| 購物車 / API 快取          | Pinia      |

## 安裝

```bash
npm install mitt
```

## 初始化

### eventBus.js

在 Vue 3 中，我們需要先初始化 mitt，然後在需要溝通的元件中使用 `on` 和 `emit` 方法，可以先建立一個 `eventBus.js` 檔案，並將初始化動作放在其中。

```js
import mitt from "mitt";

const emitter = mitt();

export default emitter;
```

### Notification.vue

這邊用一個全域通知的例子來說明，我們先建立一個 `Notification.vue` 元件，並在元件中使用 `on` 方法來接收通知。

```js
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import emitter from "../global/eventBus";

const notification = ref("");

const showNotification = (msg) => {
    notification.value = msg;
    setTimeout(() => (notification.value = ""), 3000);
};

onMounted(() => {
    emitter.on("showNotification", showNotification);
});

onUnmounted(() => {
    emitter.off("showNotification", showNotification);
});
</script>

<template>
    <div v-if="notification" class="notification">
        {{ notification }}
    </div>
</template>

<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4caf50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
}
</style>
```

### App.vue

這邊我們直接在 `App.vue` 元件引入 `Notification.vue` 元件，並在元件中使用 `emitter 的 emit` 方法來發送通知。

現在只要是掛載在 `App.vue` 元件下的元件，都可以使用 `emitter` 來發送通知。

```js
<script setup>
import Notification from "./components/Notification.vue";
import emitter from "./global/eventBus";

const emitNotification = () => {
    emitter.emit("showNotification", "Hello, world!");
};
</script>

<template>
    <Notification />
    <button @click="emitNotification">發送通知</button>
</template>
```

![Image](https://i.imgur.com/wxBty59.png)

## 參考資料

-   [mitt](https://github.com/developit/mitt)
