---
title: "[vue] Vue Transition 介紹"

keywords: [Vue3, Transition, script setup]

description: "Vue 內建了一個 <transition> 元件，用於處理元素進入與離開的動畫。"

author: WeiYun0912

og:title: "[vue] Vue Transition 介紹"

og:description: "Vue 內建了一個 <transition> 元件，用於處理元素進入與離開的動畫。"

sidebar_position: 9
---

# Vue Transition 介紹

## 簡介

Vue 內建了一個 `<transition>` 元件，用於處理元素進入與離開的動畫。

我們可以使用 `CSS` 或 `JavaScript` 來控制 淡入淡出、滑動、縮放 等效果。

適用於：`v-if`、`v-show`、`v-for` 這類元素的動態顯示/隱藏

可以透過 `CSS class` 或 `JavaScript 事件` 來控制動畫

## 基本用法：淡入淡出

以下程式碼是一個簡單的淡入淡出動畫，當點擊按鈕時，會切換顯示/隱藏 `<p>` 元素：

-   當 `show = true`，元素進場（enter），從 `opacity: 0` 變成 `1`
-   當 `show = false`，元素離場（leave），從 `opacity: 1` 變成 `0`

`transition` 內的 `name="fade"`，會自動套用以下 CSS：

-   `fade-enter-from` → 進場前 (opacity: 0)
-   `fade-enter-active` → 進場動畫 (transition: 0.5s)
-   `fade-enter-to` → 進場後 (opacity: 1)

就像我們寫 `@keyframes` 一樣，只是這些 CSS class 是 Vue 自動生成的，我們只需要給它們命名，Vue 就會自動套用。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";

const show = ref(true);
</script>

<template>
  <button @click="show = !show">切換顯示</button>

  <transition name="fade">
    <p v-if="show">🚀 Vue Transition 讓動畫變得超簡單！</p>
  </transition>
</template>

<style scope>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

## 多元素過場

如果 `v-if 控制的是不同元素`，Vue 會同時執行`「離開」和「進入」動畫`，我們可以使用 `mode="out-in"` 來讓它們順序播放。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";

const isHello = ref(true);
</script>

<template>
  <button @click="isHello = !isHello">切換</button>
  
  <transition name="fade" mode="out-in">
    <p v-if="isHello" key="hello">👋 Hello</p>
    <p v-else key="bye">👋 Goodbye</p>
  </transition>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
```

## v-for 過場

對 `v-for` 清單內的元素添加動畫，可以使用 `<transition-group>`。

-   `<transition-group>` 需要 `tag="ul"`，避免影響 HTML 結構
-   `key` 必須是唯一值，否則 Vue 不會正確執行動畫

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";

const items = ref([
  { id: 1, text: "🍎 蘋果" },
  { id: 2, text: "🍌 香蕉" },
]);

const addItem = () => {
  items.value.push({ id: Date.now(), text: "🥝 奇異果" });
};
</script>

<template>
  <button @click="addItem">新增項目</button>
  <transition-group name="list" tag="ul">
    <li v-for="item in items" :key="item.id">{{ item.text }}</li>
  </transition-group>
</template>

<style>
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
```

## 用 JavaScript 控制動畫

有時候我們需要使用 `JavaScript` 來控制動畫，這時候可以透過 `@before-enter`、`@enter`、`@leave` 來控制動畫。

-   `beforeEnter`：動畫開始前的狀態
-   `enter`：進場動畫，`done()` 用於控制結束時機
-   `leave`：離場動畫，同樣使用 `done()`

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";

const show = ref(true);

const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(-10px)";
};

const enter = (el, done) => {
  setTimeout(() => {
    el.style.transition = "all 0.5s";
    el.style.opacity = 1;
    el.style.transform = "translateY(0)";
    done();
  }, 100);
};

const leave = (el, done) => {
  el.style.transition = "all 0.5s";
  el.style.opacity = 0;
  el.style.transform = "translateY(-10px)";
  setTimeout(done, 500);
};
</script>

<template>
  <button @click="show = !show">切換</button>
  <transition @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <p v-if="show">🚀 JavaScript 控制動畫</p>
  </transition>
</template>
```
