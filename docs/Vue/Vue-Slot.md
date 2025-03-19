---
title: "[vue] Vue Slot 用法"

keywords: [vue3, vue]

description: Vue Slot 用法

author: WeiYun0912

og:title: Vue Slot 用法

og:description: Vue Slot 用法

sidebar_position: 7
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

## 父元件 使用 子元件 的屬性

把 slot 放在`子元件`的 `v-for` 內

```jsx title='AppCourseCard.vue' showLineNumbers
<template>
  <div v-for="animal in animals" :key="animal.id">
    <slot />
    <hr />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const animals = ref([
  {
    id: crypto.randomUUID(),
    name: 'tiger'
  },
  {
    id: crypto.randomUUID(),
    name: 'panda'
  },
  {
    id: crypto.randomUUID(),
    name: 'bird'
  }
])
</script>
```

在`父元件`使用`子元件`的屬性，很明顯的會出現錯誤，因為在`父元件 AppCourse`內，並沒有定義 `animal`。

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCard>
    <p>id : {{ animal.id }}</p>
    <p>name : {{ animal.name }}</p>
  </AppCourseCard>
</template>

<script setup>
import AppCourseCard from './AppCourseCard.vue'
</script>
```

現在在 `AppCourseCard` 中，修改 `slot` 的程式碼，在 `slot` 中將 `animal` 動態綁定。

```jsx title='AppCourseCard.vue' showLineNumbers
<template>
  <div v-for="animal in animals" :key="animal.id">
    <slot :animal="animal" />
    <hr />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const animals = ref([
  {
    id: crypto.randomUUID(),
    name: 'tiger'
  },
  {
    id: crypto.randomUUID(),
    name: 'panda'
  },
  {
    id: crypto.randomUUID(),
    name: 'bird'
  }
])
</script>
```

之後在 `AppCourse` 使用 `template` 並搭配 `v-slot(簡寫為 #)`，取得子元件的 `props` 即可。

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCard>
    <template #default="props">
      <p>id : {{ props.animal.id }}</p>
      <p>name : {{ props.animal.name }}</p>
    </template>
  </AppCourseCard>
</template>

<script setup>
import AppCourseCard from './AppCourseCard.vue'
</script>
```

這樣寫也可以，直接將 `template` 移除，並直接在 `v-slot` 內進行解構。

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCard v-slot="{ animal }">
    <p>id : {{ animal.id }}</p>
    <p>name : {{ animal.name }}</p>
  </AppCourseCard>
</template>

<script setup>
import AppCourseCard from './AppCourseCard.vue'
</script>
```
