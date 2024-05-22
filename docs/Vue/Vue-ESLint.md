---
title: "[vue] 個人常用的 Vue ESLint Rules"

keywords: [vue3, vue, eslint]

description: 個人常用的 Vue ESLint Rules

author: WeiYun0912

og:title: 個人常用的 Vue ESLint Rules

og:description: 個人常用的 Vue ESLint Rules
---

## 說明

[影片連結](https://www.youtube.com/watch?v=iwMzzAzYgjE)

分享一些個人在 Vue 專案常用的 ESLint Rules，可以根據個人習慣來決定規則要顯示的嚴重程度，文章都先以 error 為主。

## vue/no-undef-components

檢查有沒有在 template 使用了但卻尚未 import 的 component

```js title='eslintrc.js' showLineNumbers
/* eslint-env node */

module.exports = {
  ...
  rules: {
    'vue/no-undef-components': 'error',
  },
  ...
}
```

設定完後，現在撰寫以下程式碼會跳出錯誤提示，告訴我們 AB component 被使用了，但尚未宣告(import)。

<p style={{color : "red"}}>The AB component has been used, but not defined.</p>

```jsx title='App.vue' showLineNumbers
<template>
  <AB />
</template>
```

## vue/no-undef-properties

檢查有沒有在 template 使用了，但卻尚未定義的變數。

```js title='eslintrc.js' showLineNumbers
/* eslint-env node */

module.exports = {
  ...
  rules: {
    'vue/no-undef-properties': 'error',
  },
  ...
}
```

設定完後，現在撰寫以下程式碼會跳出錯誤提示，告訴我們 text 尚未被宣告。

<p style={{color : "red"}}>'text' is not defined.</p>

```jsx title='App.vue' showLineNumbers
<template>{{ text }}</template>
```

## vue/eqeqeq & eqeqeq

嚴格比較，不能使用 == 或 !=，一定要使用 === 或 !==。

```js title='eslintrc.js' showLineNumbers
/* eslint-env node */

module.exports = {
  ...
  rules: {
    'vue/eqeqeq': 'error',
    eqeqeq: 'error'
  },
  ...
}
```

設定完後，現在撰寫以下程式碼會跳出錯誤提示，告訴我們不能使用 `==` 或 `!=`，一定要使用 `===` 或 `!==`。

<p style={{color : "red"}}>Expected '===' and instead saw '=='.</p>

```jsx title='App.vue' showLineNumbers
<template>
  {{ a == 1 ? "Hello" : "World" }}
</template>

<script setup>
const a = 1;

const b = a == 1 ? "Hello" : "World"

console.log(b);
</script>
```

## vue/no-unused-properties

檢查 definedProps 裡面的 props 有沒有被使用

```js title='eslintrc.js' showLineNumbers
/* eslint-env node */

module.exports = {
  ...
  rules: {
    'vue/no-unused-properties': 'error',
  },
  ...
}
```

設定完後，現在撰寫以下程式碼會跳出錯誤提示，告訴我們 `products` 被宣告了但沒有被使用。

<p style={{color : "red"}}>'products' of property found, but never used.</p>

```jsx title='App.vue' showLineNumbers
<template>
  <h1>Hello World</h1>
</template>

<script setup>
defineProps({
  products :{
    type : Array,
    default : () => []
  }
})
</script>

```

## vue/no-unused-emit-declarations

檢查 emit 裡面的 event 有沒有被使用

```js title='eslintrc.js' showLineNumbers
/* eslint-env node */

module.exports = {
  ...
  rules: {
    'vue/no-unused-emit-declarations': 'error',
  },
  ...
}
```

設定完後，現在撰寫以下程式碼會跳出錯誤提示，告訴我們 `addTodo` emit 被宣告了，但尚未被使用。

<p style={{color : "red"}}>'addTodo' is defined as emit but never used..</p>

```jsx title='App.vue' showLineNumbers
<template>
  <h1>Hello World</h1>
</template>

<script setup>
const emits = defineEmits(["addTodo"]);
</script>
```

## array-callback-return

強制檢查 array function 有沒有寫 return

```js title='eslintrc.js' showLineNumbers
/* eslint-env node */

module.exports = {
  ...
  rules: {
    'array-callback-return': 'error',
  },
  ...
}
```

設定完後，現在撰寫以下程式碼會跳出錯誤提示，告訴我們 map function 沒有 return value。

<p style={{color : "red"}}>Array.prototype.map() expects a return value from arrow function.</p>

```jsx title='App.vue' showLineNumbers
<template>
  <h1>Hello World</h1>
</template>

<script setup>
const a = [];

const b = a.map((item) => {
  if(item === 1){
    console.log(item);
  }
})
</script>
```

## 設定檔

```js title='eslintrc.js' showLineNumbers
/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-prettier/skip-formatting",
  ],

  rules: {
    "vue/no-undef-components": "error",
    "vue/no-undef-properties": "error",
    "vue/eqeqeq": "error",
    "vue/no-unused-properties": "error",
    "vue/no-unused-emit-declarations": "error",
    "array-callback-return": "error",
    eqeqeq: "error",
  },

  parserOptions: {
    ecmaVersion: "latest",
  },
};
```
