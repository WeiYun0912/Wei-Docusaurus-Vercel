---
title: "[vue] Vue 使用 Composable 將相同的程式碼邏輯抽離"

keywords: [vue3, vue]

description: Vue 使用 Composable 將相同的程式碼邏輯抽離

author: WeiYun0912

og:title: Vue 使用 Composable 將相同的程式碼邏輯抽離

og:description: Vue 使用 Composable 將相同的程式碼邏輯抽離
---

## 說明

如果我們的 component 包含許多複雜且重複的程式碼，並且這些程式碼涉及到`狀態管理`，即`響應式數據`的處理，則可以通過將重複的程式碼抽離出來，儲存在單獨的檔案中。

當需要在其他 component 中使用這些程式碼時，只需 import 這個檔案即可，Vue 稱這種做法為 `Composable`，在 React 就是 `Custom Hook`。

## Composable

試想一下，以下的程式碼如果需要套用在多個 component 的話，我們每次都需要撰寫同樣的程式碼。

```jsx title='App.vue' showLineNumbers
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

所以現在就將需要重複使用的程式碼抽離出來，並新增到一個檔案，我們可以稱它為 `useMouse`，Composable 的命名習慣，也跟 React 一樣，會在前面加上 `use`。

```js title='mouse.js' showLineNumbers
import { ref, onMounted, onUnmounted } from "vue";

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener("mousemove", update));
  onUnmounted(() => window.removeEventListener("mousemove", update));

  return { x, y };
}
```

而現在 `App.vue` 的程式碼就可以改成這樣

```jsx title='App.vue' showLineNumbers
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```
