---
title: "[vue] Vue Slot 用法"

keywords: [vue3, vue]

description: Vue Slot 用法

author: WeiYun0912

og:title: Vue Slot 用法

og:description: Vue Slot 用法
---

## 說明

介紹一下 Vue 的 slot 用法

## slot

如果想要傳送子元素到另外一個 Component，我們可以使用 `<slot></slot>`，這就跟 React 的 children 相似。

我們在 `AppCourseCard` 底下傳入一個 `p` 元素，並且在 `AppCourseCard` 內，使用 `<slot></slot>`

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCard>
    <p>Hello World</p>
  </AppCourseCard>
</template>

<script setup>
import AppCourseCard from './AppCourseCard.vue'
</script>
```

```jsx title='AppCourseCard.vue' showLineNumbers
<template>
  <h1>AppCourseCard</h1>
  <div>
    <slot></slot>
  </div>
</template>
```

可以看到，我們的 `<slot></slot>` 元素在畫面上被渲染 `p` 元素。

![Image](https://i.imgur.com/neP9QeN.png)

## slot 預設值

如果今天 Component 沒有傳入任何的子元素，我們也可以給 slot 預設值。

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCard></AppCourseCard>
</template>

<script setup>
import AppCourseCard from './AppCourseCard.vue'
</script>

```

```jsx title='AppCourseCard.vue' showLineNumbers
<template>
  <h1>AppCourseCard</h1>
  <div>
    <slot>
      <b>沒有傳入子元素</b>
    </slot>
  </div>
</template>
```

![Image](https://i.imgur.com/tlDNHri.png)

## 使用多個 slot

如果要使用多個 slot 的話，可以使用 `#` 關鍵字，相當於使用 `v-slot`。

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCard>
    <template #title>
      <h2>我是 v-slot title</h2>
    </template>
    <template #description>
      <p>我是</p>
      <p>v-slot</p>
      <p>description</p>
    </template>
  </AppCourseCard>
</template>

<script setup>
import AppCourseCard from './AppCourseCard.vue'
</script>
```

然後在 Component 的 slot 使用 name 來接收值

```jsx title='AppCourseCard.vue' showLineNumbers
<template>
  <h1>AppCourseCard</h1>
  <div>
    <slot name="title"></slot>
  </div>
  <div>
    <slot name="description"></slot>
  </div>
</template>
```

![Image](https://i.imgur.com/736khbX.png)
