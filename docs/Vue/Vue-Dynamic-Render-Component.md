---
title: "[vue] Vue 動態載入 Component"

keywords: [vue3, vue]

description: Vue 動態載入 Component

author: WeiYun0912

og:title: Vue 動態載入 Component

og:description: Vue 動態載入 Component
---

## 說明

記錄一下怎麼動態載入 component

## Component :is

使用 Component 的 `:is` 放入要載入的 component

```jsx title='App.vue' showLineNumbers
<template>
  <Component :is="current" />
  <button @click="switchTab('AppCourseCard')">Change AppCourseCard</button>
  <button @click="switchTab('CommonInput')">Change CommonInput</button>
</template>

<script setup>
import { ref } from 'vue'
import AppCourseCard from './AppCourseCard.vue'
import CommonInput from './CommonInput.vue'

const tabs = {
  AppCourseCard,
  CommonInput
}

const current = ref(tabs.AppCourseCard)

const switchTab = (tabName) => {
  current.value = tabs[tabName]
}
</script>
```

## KeepAlive

在來回切換 component 的時候，會發現原本輸入的值會消失，這時候可以用 `KeepAlive` component 來保留值。

```jsx title='App.vue' showLineNumbers
<template>
  <KeepAlive>
    <Component :is="current" />
  </KeepAlive>
  <button @click="switchTab('AppCourseCard')">Change AppCourseCard</button>
  <button @click="switchTab('CommonInput')">Change CommonInput</button>
</template>

<script setup>
import { ref } from 'vue'
import AppCourseCard from './AppCourseCard.vue'
import CommonInput from './CommonInput.vue'

const tabs = {
  AppCourseCard,
  CommonInput
}

const current = ref(tabs.AppCourseCard)

const switchTab = (tabName) => {
  current.value = tabs[tabName]
}
</script>
```
