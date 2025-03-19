---
title: "[vue] Vue 3.3  defineModel() 介紹"

keywords: [Vue3, defineModel, v-model, script setup]

description: "Vue 3.3 新增 defineModel()，讓子元件 v-model 變得更直覺，避免手動 defineProps() 和 defineEmits()。本篇文章將介紹 defineModel() 的使用方式與範例。"

author: WeiYun0912

og:title: "[vue] defineModel() 讓 v-model 在 <script setup> 更直覺"

og:description: "Vue 3.3  defineModel() 介紹"

sidebar_position: 12
---

# Vue 3.3 defineModel() 介紹

## 簡介

在 Vue 3.3 之前，子元件要接收 v-model 時，需要：

-   手動定義 props 來接收數據
-   使用 emits 來更新數據
-   綁定 v-model 到 props

這樣會讓 `<script setup>` 變得比較冗長，`defineModel()` 則簡化了這個流程。

## 不使用 defineModel() 的寫法

如果不使用 `defineModel()`，我們需要手動定義 props 和 emits，這樣會讓 `<script setup>` 變得比較冗長。

<!-- prettier-ignore -->
```html title="Parent.vue" showLineNumbers
<script setup>
import { ref } from "vue";
import Child from "./Child.vue";

const message = ref("Hello Vue!");
</script>

<template>
    <Child v-model="message" />
    <p>{{ message }}</p>
</template>
```

<!-- prettier-ignore -->
```html title="Child.vue" showLineNumbers
<!-- Child.vue -->
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const updateValue = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <input :value="props.modelValue" @input="updateValue" />
</template>
```

## 使用 defineModel() 的寫法

使用 `defineModel()` 可以讓子元件接收 `v-model` 變得更直覺，避免手動定義 `props` 和 `emits`。

<!-- prettier-ignore -->
```html title="Parent.vue" showLineNumbers
<script setup>
import { ref } from "vue";
import Child from "./Child.vue";

const message = ref("Hello Vue!");
</script>

<template>
    <Child v-model="message" />
    <p>{{ message }}</p>
</template>
```

<!-- prettier-ignore -->
```html title="Child.vue" showLineNumbers
<!-- Child.vue -->
<script setup>
const model = defineModel();
</script>

<template>
    <input v-model="model" />
</template>
```

## 多個 v-model

如果子元件需要多個 `v-model`，你可以給 `defineModel()` 傳入參數來命名不同的 `v-model`。

<!-- prettier-ignore -->
```html title="Parent.vue" showLineNumbers
<!-- Parent.vue -->
<script setup>
import { ref } from "vue";
import Child from "./Child.vue";

const articleTitle = ref("Vue 3.3 `defineModel()`");
const articleContent = ref("這是一篇關於 `defineModel()` 的文章。");
</script>

<template>
    <Child v-model:title="articleTitle" v-model:content="articleContent" />

    <p>{{ articleTitle }}</p>
    <p>{{ articleContent }}</p>
</template>
```

<!-- prettier-ignore -->
```html title="Child.vue" showLineNumbers
<!-- Child.vue -->
<script setup>
const title = defineModel("title");
const content = defineModel("content");
</script>

<template>
  <input v-model="title" placeholder="標題" />
  <textarea v-model="content" placeholder="內容"></textarea>
</template>
```

| 方法             | Vue 3.3+ defineModel()       | 傳統 defineProps() + defineEmits() |
| ---------------- | ---------------------------- | ---------------------------------- |
| 語法簡單性       | 更簡潔                       | 需要手動 props & emit              |
| 支援多個 v-model | 直接使用 defineModel("name") | 需要手動 props 定義                |
| 預設值           | defineModel({ default: 值 }) | 需要 props 設定 default            |
| 適用場景         | 表單、輸入框、可編輯元件     | 自訂 v-model 邏輯的情境            |
