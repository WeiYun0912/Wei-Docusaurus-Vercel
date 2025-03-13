---
title: "[vue] Vue 自訂語法 Directive 用法"

keywords: [vue3, vue]

description: Vue 自訂語法 Directive 用法

author: WeiYun0912

og:title: Vue 自訂語法 Directive 用法

og:description: Vue 自訂語法 Directive 用法
---

## 說明

有時候我們會需要操作原生的 DOM 或取得 DOM 元素，像是要讓 input 在 mounted 階段的時候，就自動 focus，
雖然我們可以直接在元素上使用 `ref`，但如果同樣的操作邏輯需要用到很多次，我們就可以使用 `directive`，
來將重複的邏輯抽離出來。

這樣做的優點有以下：

-   操作 DOM 元素：直接訪問和操作 DOM 元素
-   抽離邏輯：在多個元件中重複使用相同的 DOM 操作邏輯。
-   優化現有元件：為現有的元件新增額外的功能，而不需要修改元件本身。

我們可以在 directive 裡面使用以下幾種生命週期的方法

-   created
-   beforeMount
-   mounted
-   beforeUpdate
-   updated
-   beforeUnmount
-   unmounted

## focus

現在來使用 directive 設定 focus 功能，我們需要在 `main.js` 裡面針對 `app` 來設定。

這裡我們設定 focus 指令，並且在 mounted 階段的時候，將元素執行 focus function，這裡傳遞進來的 `el`，就是 DOM 元素本身。

```js title='main.js' showLineNumbers
...

const app = createApp(App)

app.directive('focus', {
  mounted(el) {
    // console.log(el);
    el.focus()
  }
})

app.mount('#app')
```

設定完後，只要在元素上使用 `v-focus` 即可套用我們上面設定的功能。

```jsx title='AppCourseInput.vue' showLineNumbers
<template>
  <input v-focus type="text" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
const inputControl = ref(null)
onMounted(() => {
  inputControl.value.focus()
})
</script>
```

## 取得響應式數據

如果我們想要傳入響應式數據的話，需要在 directive 的 function 使用第二個參數，通常叫做 `binding`，可以先把它理解為外部傳遞進來的參數。

這邊可以不指定生命週期，直接使用 directive 提供給我們的 function。

我們希望只要使用 `v-fsize` 的元素，可以傳遞一個字體大小的參數進來，並透過直接訪問該 DOM 元素的 `style` 來改變字體大小。

```js title='main.js' showLineNumbers
...

const app = createApp(App)

app.directive('fsize', (el, binding) => {
  el.style.fontSize = `${binding.value}px`
})
app.mount('#app')
```

```jsx title='AppCourseInput.vue' showLineNumbers
<template>
  <p v-fsize="fontSize">Hello World</p>
  <button @click="fontSize += 1">+</button>
  <button @click="fontSize -= 1">-</button>
</template>

<script setup>
import { ref } from 'vue'

const fontSize = ref(18);
</script>
```
