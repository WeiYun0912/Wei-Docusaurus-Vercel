---
title: "[vue] Vue Lazy Component"

keywords: [vue3, vue, lazy]

description: Vue Lazy Component

author: WeiYun0912

og:title: Vue Lazy Component

og:description: Vue Lazy Component
---

## 說明

有時候我們會希望某個 component 在`需要被載入`的時候，才去載入該 component，就像是 React 的 `lazy` 用法。

一樣是建議針對一開始載入時間特別久的 component 來設定

## definedAsyncComponent

如果我們現在的程式碼為以下，一開始畫面中只會顯示 `AppCourseCard`，直到我們按下 `Change CommonInput` 按鈕，將渲染的 component 更改為 `CommonInput`。

```jsx title='App.vue' showLineNumbers
<template>
  <Component :is="current" />
  <button @click="switchTab('AppCourseCard')">Change AppCourseCard</button>
  <button @click="switchTab('CommonInput')">Change CommonInput</button>
</template>

<script setup>
import { ref } from 'vue'
import AppCourseCard from '@/components/AppCourseCard.vue'
import CommonInput from '@/components/CommonInput.vue'

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

但現在在瀏覽器的開發者管理工具的 `Source` -> `src` -> `components` 資料夾，你應該會看到這兩個 component 被載入進來，但 `CommonInput` 尚未被渲染到我們的畫面上。

![Image](https://i.imgur.com/v7oYk9S.png)

現在將程式碼改為以下，使用 `defineAsyncComponent` 將 `CommonInput` 包起來。

```jsx title='App.vue' showLineNumbers
<template>
  <Component :is="current" />
  <button @click="switchTab('AppCourseCard')">Change AppCourseCard</button>
  <button @click="switchTab('CommonInput')">Change CommonInput</button>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue'
import AppCourseCard from '@/components/AppCourseCard.vue'
// import CommonInput from '@/components/CommonInput.vue'

const CommonInput = defineAsyncComponent(() => import('@/components/CommonInput.vue'))

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

現在一開始載入的時候，就不會載入 `CommonInput` 了，直到我們按下 `Change CommonInput` 按鈕。

![Image](https://i.imgur.com/manuuGJ.png)
