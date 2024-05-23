---
title: "[vue] Vue Provide 與 Inject 用法"

keywords: [vue3, vue]

description: Vue Provide 與 Inject 用法

author: WeiYun0912

og:title: Vue Provide 與 Inject 用法

og:description: Vue Provide 與 Inject 用法
---

## 說明

Vue 與 React 一樣，都會遇到 `Prop Drilling` 的問題，React 的原生解法是使用 `context`，Vue 則是使用 `provide` 和 `inject`。

## provide

先在父元件使用 `provide` 定義要給子元件的資料

我們使用了 `provide` 定義了 `title`，而 `title` 的值為 `測試標題`。

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCard />
</template>

<script setup>
import { provide } from 'vue'
import AppCourseCard from './AppCourseCard.vue'

provide('title', '測試標題')
</script>
```

## inject

現在只要在 `AppCourse` 底下的子元件，都能使用 `inject` 來取得 `title`。

```jsx title='AppCourseCard.vue' showLineNumbers
<template>
  <AppCourseCardTitle />
  {{title}}
</template>

<script setup>
import AppCourseCardTitle from './AppCourseCardTitle.vue'

import { inject } from 'vue'

const title = inject('title')
</script>
```
