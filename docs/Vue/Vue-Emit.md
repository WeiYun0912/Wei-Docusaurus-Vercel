---
title: "[vue] Vue Emit 用法"

keywords: [vue3, vue]

description: Vue Emit 用法

author: WeiYun0912

og:title: Vue Emit 用法

og:description: Vue Emit 用法
---

## 說明

如果要在 `子元件(Child Component)` 傳值給 `父元件(Parent Component)`，則可以在子元件使用 emit 自訂 event，然後在父元件監聽該 event。

## definedEmits

先在子元件使用 `definedEmits` 來定義 `emit`，我們的自訂 event 名稱叫做 `addTodo`。

使用 emit 後，第一個參數放 event 名稱，第二個參數放要傳遞給父元件的值。

```jsx title='AppCourseCard.vue' showLineNumbers
<template>
  <button @click="addTodo">Add Todo</button>
</template>

<script setup>
const emit = defineEmits(['add-Todo'])

const addTodo = () => {
  emit('add-Todo', crypto.randomUUID())
}
</script>
```

接著在父元件監聽該 event，並撰寫該 event 被觸發後，要執行的 function。

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseCard @add-todo="handleAddTodo" />
</template>

<script setup>
import AppCourseCard from './AppCourseCard.vue'

const handleAddTodo = (id) => {
  console.log(id) // 這邊就會接收到 子元件傳遞過來的參數 (crypto.randomUUID)
}
</script>
```
