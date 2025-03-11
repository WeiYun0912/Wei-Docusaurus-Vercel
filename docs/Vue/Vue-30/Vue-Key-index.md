---
title: "[Vue] Vue 3 使用 index 當 key 的問題"

keywords: [Vue3, Key, v-for, Virtual DOM, 效能]

description: "在 Vue 3 中，v-for 需要 :key 來幫助 Virtual DOM 追蹤元素，但錯誤的 :key（特別是 index）可能會導致非預期的行為與效能問題。"

author: WeiYun0912

og:title: "[Vue] Vue 3 使用 index 當 key 的問題"

og:description: "在 Vue 3 中，v-for 需要 :key 來幫助 Virtual DOM 追蹤元素，但錯誤的 :key（特別是 index）可能會導致非預期的行為與效能問題。"
---

# Vue 3 使用 index 當 key 的問題

## 簡介

在 Vue 3 中，當我們使用 v-for 來渲染清單時，Vue 會根據 :key 來追蹤每個元素，這樣：

-   當陣列變動時，Vue 可以精準更新 DOM，而不是重新渲染整個清單
-   避免 UI 錯亂，例如表單輸入框內容消失

## 使用 index 當 key 的問題

雖然使用 index 當 key 很方便，但當陣列變動時，Vue 會重新渲染整個清單，這樣會導致效能問題。

## 錯誤範例

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";

const items = ref([{ text: "項目 1" }, { text: "項目 2" }, { text: "項目 3" }]);

const addItem = () => {
    items.value.push({ text: "新項目" });
};

const removeItem = (index) => {
    items.value.splice(index, 1);
};
</script>

<template>
    <div>
        <h2>使用 index 作為 key（錯誤示範）</h2>
        <ul>
            <li v-for="(item, index) in items" :key="index">
                <input v-model="item.text" />
                <button @click="removeItem(index)">刪除</button>
            </li>
        </ul>
        <button @click="addItem">新增項目</button>
    </div>
</template>
```

因為我們的清單是使用 `index` 當 `key`，所以當我們新增或刪除項目時，Vue 會重新渲染整個清單，這樣會導致效能問題，看畫面可能不太明顯，所以我們看 DOM。

當我們刪除 `item1` 的時候，會看到 DOM 的 `ul li` 都會閃一下，這是因為 Vue 重新渲染整個清單，導致 DOM 重新渲染。

![Image](https://i.imgur.com/1LwBkoA.png)

## 正確範例

現在我們把 `key` 改成 `item.id`，這樣當我們新增或刪除項目時，Vue 會精準更新 DOM，而不是重新渲染整個清單。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";

const items = ref([
    { id: crypto.randomUUID(), text: "item 1" },
    { id: crypto.randomUUID(), text: "item 2" },
    { id: crypto.randomUUID(), text: "item 3" },
]);

const addItem = () => {
    items.value.push({ id: crypto.randomUUID(), text: "new item" });
};

const removeItem = (index) => {
    items.value.splice(index, 1);
};
</script>

<template>
    <div>
        <h2>使用獨一無二的 id 作為 key</h2>
        <ul>
            <li v-for="(item, index) in items" :key="item.id">
                <input v-model="item.text" :placeholder="item.text" />
                <button @click="removeItem(index)">刪除</button>
            </li>
        </ul>
        <button @click="addItem">新增項目</button>
    </div>
</template>
```

![Image](https://i.imgur.com/yJcyjBj.png)

## 什麼時候 index 是安全的 ?

在 `靜態陣列（不會變動）` 或 `清單只是顯示用途（沒有 v-model 或互動）` 時，可以安全使用 index，也就是沒有`新增`、`刪除`、`修改`的時候。

```html
<ul>
    <li v-for="(item, index) in items" :key="index">{{ index + 1 }}. {{ item }}</li>
</ul>
```
