---
title: "[vue] Vue 如何定義全域 Component"

keywords: [vue3, vue, global component]

description: Vue 如何定義全域 Component

author: WeiYun0912

og:title: Vue 如何定義全域 Component

og:description: Vue 如何定義全域 Component
---

## 說明

介紹一下怎麼在 Vue 定義全域 Component，讓我們的其他檔案不用 import 該 component 也能直接使用。

## Component

會使用到全域 component 通常是因為該 component 在該專案非常常使用到，而我們不希望每次使用該 component 的時候都要進行複雜的設定。

像是 `vue-router` 的 `<RouterView />` 和 `<RouterLink />`，我們只要在 `main.js` 去 `use` 我們包裝好的 router，就不用在每支檔案 import 這兩個常用的 component。

## Global Component

我們這邊簡單的建立一支 `CommonInput` 的 component，該 component 會接收 `type` 和 `placeholder` 兩個 props，並且 component 內的 input 有設定簡單的 style。

```jsx title='CommonInput.jsx' showLineNumbers
<template>
  <input
    :type="type"
    :placeholder="placeholder"
    class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
  />
</template>

<script setup>
defineProps({
  placeholder: {
    type: String,
    default: () => ''
  },
  type: {
    type: String,
    default: () => 'text'
  }
})
</script>
```

來到 `main.js` 並把 `CommonInput` 引入，引入後直接使用 `app.component` 來定義我們的全域 component。

第一個參數填入我們希望在其他 component 使用該全域 component 的時候，應該要用什麼樣的名稱，第二個參數就直接把 component 放進去即可。

```js title='main.js' showLineNumbers
import "./assets/main.css";
import { createApp } from "vue";
import CommonInput from "@/components/CommonInput.vue";
import App from "./App.vue";
const app = createApp(App);

app.component("CommonInput", CommonInput);

app.mount("#app");
```

現在開啟隨便一個 component，並直接在 `template` 內使用 `<CommonInput />` 就能看到效果了。

```jsx title='App.vue' showLineNumbers
<template>
  <CommonInput type="text" placeholder="Enter some text..." />
</template>
```

## ESLint 設定

如果我們的 ESLint 有使用 `vue/no-undef-components` 這個 rule，應該會出現 `The '<CommonInput>' component has been used, but not defined.`。

這時候只要打開 ESLint 的檔案，並使用 `globals` 來告訴 ESLint 我們有哪些全域 component 即可。

```js title='eslintrc.cjs' showLineNumbers
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  ...
  globals: {
    CommonInput: 'readonly'
  },
  ...
}
```
