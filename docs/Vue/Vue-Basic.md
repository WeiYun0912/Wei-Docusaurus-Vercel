---
title: "[vue] Vue 基礎語法"

keywords: [vue3, vue]

description: Vue 基礎語法

author: WeiYun0912

og:title: Vue 基礎語法

og:description: Vue 基礎語法
---

## 說明

記錄一下 Vue 常用的基礎語法

## v-bind

`v-bind` 是用來將數據綁定到 HTML 元素上的功能，v-bind 是屬於單向數據綁定。

以下面程式碼為例，如果想要綁定動態的數據，這樣寫是無效的，Vue 會直接把這段 a 連結的 href 當成字串。

```jsx title='App.vue' showLineNumbers
<template>
  <a href="href">Youtube</a>
</template>

<script setup>
const href = 'https://www.youtube.com/'
</script>

```

我們必須在 href attr 前面加上 v-bind，但因為 v-bind 太常使用了，所以 Vue 也使用了 `:` 語法糖來代替 v-bind，但功能是一樣的。

```jsx title='App.vue' showLineNumbers
<template>
  <a v-bind:href="href">Youtube</a>
</template>

<script setup>
const href = 'https://www.youtube.com/'
</script>

```

所以這樣寫也是可以的，也建議要使用 v-bind 的話，這樣寫就好，現在這個 a 連結就會連結到 `https://www.youtube.com/`。

```jsx title='App.vue' showLineNumbers
<template>
  <a :href="href">Youtube</a>
</template>

<script setup>
const href = 'https://www.youtube.com/'
</script>

```

## v-model

## v-once
