---
title: "[vue]  Vue 使用動態元件渲染 HTML"

keywords: [vue3, vue]

description: Vue 使用動態元件渲染 HTML

author: WeiYun0912

og:title: Vue 使用動態元件渲染 HTML

og:description: Vue 使用動態元件渲染 HTML
---

## 說明

介紹一下怎麼使用動態元件來渲染 HTML 元素

## 動態元件 :is

我們想要讓 `AppCourseCardTitle` 可以根據傳入的 `level` prop，來決定要渲染哪個 HTML 元素，例如 `h1` ~ `h5`。

如果 `level` 傳入 1 的話，`AppCourseCardTitle` 就會渲染 h1 元素，以此類推。

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCardTitle level="1">Hello</AppCourseCardTitle>
  <AppCourseCardTitle level="2">Hello</AppCourseCardTitle>
  <AppCourseCardTitle level="3">Hello</AppCourseCardTitle>
  <AppCourseCardTitle level="4">Hello</AppCourseCardTitle>
  <AppCourseCardTitle level="5">Hello</AppCourseCardTitle>
</template>

<script setup>
import AppCourseCardTitle from './AppCourseCardTitle.vue'
</script>
```

在 `AppCourseCardTitle` 中，我們直接使用 `Component`，並使用 `:is` 來告訴這個 Component 應該要渲染什麼樣的元素。

而 `:is` 我們放入 `heading`，`heading` 是我們使用 `computed` 計算出來的結果，如果 `level` 的值是 1，就回傳 `h1`，以此類推。

```jsx title='AppCourseCardTitle.vue' showLineNumbers
<template>
  <Component :is="heading"><slot></slot></Component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  level: {
    type: String,
    default: () => '1'
  }
})

const { level } = props

const heading = computed(() => `h${level}`)
</script>
```
