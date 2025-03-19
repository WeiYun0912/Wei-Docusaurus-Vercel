---
title: "[vue] Vue nextTick 介紹"

keywords: [Vue3, nextTick, script setup]

description: "在 Vue 3 中，當 ref 或 reactive 變數更新時，Vue 不會立刻更新 DOM，而是 批次處理 (batch update)，這樣可以提升效能，但有時會導致 你執行的程式碼拿到舊的 DOM 狀態，這時候就可以使用 nextTick 來解決這個問題"

author: WeiYun0912

og:title: "[vue] Vue nextTick 介紹"

og:description: "在 Vue 3 中，當 ref 或 reactive 變數更新時，Vue 不會立刻更新 DOM，而是 批次處理 (batch update)，這樣可以提升效能，但有時會導致 你執行的程式碼拿到舊的 DOM 狀態，這時候就可以使用 nextTick 來解決這個問題"

sidebar_position: 5
---

# Vue nextTick 介紹

## 簡介

在 Vue 3 中，當 ref 或 reactive 變數更新時，Vue 不會立刻更新 DOM，而是 `批次處理 (batch update)`，這樣可以提升效能，但有時會導致 你執行的程式碼拿到舊的 DOM 狀態，這時候就可以使用 `nextTick` 來解決這個問題

## 沒有 nextTick() 時的問題

下面的範例是一個 `點擊按鈕` 後，會動態新增 `<li>` 元素，並`聚焦(focus)`輸入框，但 不使用 `nextTick()` 時，輸入框不會正確聚焦，可以實際操作看看。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";

const items = ref([{ text: "" }]);
const inputRefs = ref([]);

const addItem = () => {
  items.value.push({ text: "" }); // Vue 還未更新 DOM
  inputRefs.value[items.value.length - 1]?.focus(); // ❌ 這行不會生效，因為 Vue 尚未渲染新的 input
};
</script>

<template>
  <div>
    <button @click="addItem">新增項目</button>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <input :ref="(el) => inputRefs[index] = el" v-model="item.text" placeholder="輸入內容" />
      </li>
    </ul>
  </div>
</template>
```

![](https://i.imgur.com/OnZMnVk.gif)

## 使用 nextTick() 解決

使用 `nextTick()` 可以確保在 DOM 更新後執行，這樣就可以拿到最新的 DOM 狀態，可以實際操作看看。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref, nextTick } from "vue";

const items = ref([{ text: "" }]);
const inputRefs = ref([]);

const addItem = async () => {
  items.value.push({ text: "" }); // Vue 尚未更新 DOM

  await nextTick(); // ✅ 確保 Vue 更新 DOM 完成
  inputRefs.value[items.value.length - 1]?.focus(); // ✅ 這行現在會成功執行
};
</script>

<template>
  <div>
    <button @click="addItem">新增項目</button>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <input :ref="(el) => inputRefs[index] = el" v-model="item.text" placeholder="輸入內容" />
      </li>
    </ul>
  </div>
</template>
```

![](https://i.imgur.com/TYxekgk.gif)

## 什麼時候需要使用 nextTick()

| 情境                                              | 是否需要 nextTick() |
| ------------------------------------------------- | ------------------- |
| 等待 DOM 更新後操作（如 focus、scroll、計算大小） | ✅ 需要             |
| 一般變數變更（無需 DOM 操作）                     | ❌ 不需要           |
| Vue 內建的 watch() 監聽變數變更                   | ❌ 不需要           |

## nextTick() vs setTimeout()

有些人可能會想：「那如果我用 setTimeout() 來等待 Vue 更新呢？」

```js
setTimeout(() => {
    inputRefs.value[items.value.length - 1]?.focus();
}, 0);
```

這樣雖然可行，但有幾個問題：

-   `setTimeout()` 等待時間不固定，如果 Vue 更新慢了一點，你可能一樣會拿到舊的 DOM
-   `nextTick()` 專門為 Vue 設計，確保 Vue 更新後才執行

## 小小總結

-   Vue 的 DOM 更新是非同步的，nextTick() 確保程式碼執行在最新 DOM 之後
-   適用於需要操作 DOM（如 focus()、scroll()、取得元素大小）
-   比 setTimeout() 更可靠，確保 Vue 真的完成更新
