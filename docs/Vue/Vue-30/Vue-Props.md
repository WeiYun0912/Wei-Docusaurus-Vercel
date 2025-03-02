---
title: "[Vue] Vue 3 父元件傳遞 Props 到孫元件的 4 種常見方法"

keywords: [Vue3, Props, provide/inject, Pinia]

description: Vue 3 中如何將 Props 從父元件傳遞到孫元件，並介紹 4 種不同的方式來處理這個需求。

author: WeiYun0912

og:title: "[Vue] Vue 3 父元件傳遞 Props 到孫元件的 4 種常見方法"

og:description: "Vue 3 中如何將 Props 從父元件傳遞到孫元件，並介紹 4 種不同的方式來處理這個需求。"
---

# Vue 3：從父元件傳遞 Props 到子元件再到孫元件的常見方法

## 簡介

在 Vue 3 中，當我們要將資料從 **父元件 (Parent)** 傳遞到 **子元件 (Child)**，再傳遞到 **孫元件 (GrandChild)**，最常見的方法包括：

1. **直接透過 `props` 一層層傳遞**（適合簡單應用）
2. **使用 `$attrs` 讓 Vue 自動傳遞 Props**（適合不需要中間層元件修改 props 的情境）
3. **使用 `provide/inject` 來讓祖孫元件直接溝通**（適合多層級元件）
4. **使用 Pinia 來做全域狀態管理**（適合共享狀態）

這篇文章將示範這 4 種方法，並比較它們的優缺點，幫助你選擇最適合的解法。

---

## 方法 1：直接透過 Props 一層層傳遞

> **適用場景**
>
> -   元件層級較淺（父 → 子 → 孫）
> -   每個元件都需要這個 Props

這是最基本的 Vue 3 **Props 傳遞方式**，但如果層級過深，可能會變得難以維護。

### 例子

```js
<!-- Parent.vue -->
<script setup>
import Child from "./Child.vue";

const message = "來自 Parent.vue 的訊息";
</script>

<template>
    <div>
        <h2>父元件</h2>
        <Child :message="message" />
    </div>
</template>
```

```js
<!-- Child.vue -->
<script setup>
import GrandChild from "./GrandChild.vue";
defineProps(["message"]);
</script>

<template>
    <div>
        <h3>子元件</h3>
        <GrandChild :message="message" />
    </div>
</template>
```

```js
<!-- GrandChild.vue -->
<script setup>
defineProps(["message"]);
</script>

<template>
    <div>
        <h4>孫元件</h4>
        <p>來自父元件的訊息：{{ message }}</p>
    </div>
</template>
```

✅ **優點**：

-   簡單直觀，每個元件都能清楚知道 `props` 來源
-   適合 **層級較少的應用**

❌ **缺點**：

-   當元件層級增加時，需要在每一層**顯式傳遞 `props`**，會造成「props drilling」問題
-   如果 `props` 很多，每一層都要寫 `defineProps`，程式碼冗長

---

## 方法 2：使用 `$attrs` 自動傳遞 Props

> **適用場景**
>
> -   **中間層（子元件）不需要使用 `props`**
> -   需要**讓 Vue 自動傳遞 `props` 到孫元件**

Vue 3 提供 `useAttrs()`，可以讓我們 **自動將未定義的 `props` 傳遞到子元件**，避免手動撰寫 `defineProps()`。

### 例子

```js
<!-- Parent.vue -->
<script setup>
import Child from "./Child.vue";

const message = "來自 Parent.vue 的訊息";
</script>

<template>
    <div>
        <h2>父元件</h2>
        <Child :message="message" />
    </div>
</template>
```

```js
<!-- Child.vue -->
<script setup>
import GrandChild from "./GrandChild.vue";
import { useAttrs } from "vue";

const attrs = useAttrs();
</script>

<template>
    <div>
        <h3>子元件</h3>
        <GrandChild v-bind="attrs" />
    </div>
</template>
```

```js
<!-- GrandChild.vue -->
<script setup>
defineProps(["message"]);
</script>

<template>
    <div>
        <h4>孫元件</h4>
        <p>來自父元件的訊息：{{ message }}</p>
    </div>
</template>
```

✅ **優點**：

-   不需要手動在每個中間元件加 `props`
-   適合有 **許多不同的 `props` 需要傳遞** 的情境

❌ **缺點**：

-   **`$attrs` 只會傳遞未定義的 `props`**，如果 `Child.vue` 有 `defineProps(["message"])`，`message` 就不會被傳遞

---

## 方法 3：使用 `provide/inject` 讓祖孫元件直接溝通

> **適用場景**
>
> -   **層級較深**（父 → 子 → 孫 → 曾孫）
> -   不希望中間元件處理 `props`
> -   需要**共享可變資料**

### 例子

```js
<!-- Parent.vue -->
<script setup>
import { provide } from "vue";
import Child from "./Child.vue";

const message = "來自 Parent.vue 的訊息";
provide("message", message);
</script>

<template>
    <div>
        <h2>父元件</h2>
        <Child />
    </div>
</template>
```

```js
<!-- GrandChild.vue -->
<script setup>
import { inject } from "vue";

const message = inject("message");
</script>

<template>
    <div>
        <h4>孫元件</h4>
        <p>來自父元件的訊息：{{ message }}</p>
    </div>
</template>
```

✅ **優點**：

-   可以直接讓孫元件存取資料，不需要經過中間層
-   更適合深層元件
-   可以動態更新資料（如果 provide 提供的是 ref()）

❌ **缺點**：

-   provide/inject 不是響應式的，如果 provide("message", "xxx")，孫元件不會自動更新，除非傳 ref()

---

## 方法 4：使用 `Pinia` 來全域管理狀態

> **適用場景**
>
> -   需要跨頁面、跨元件共享資料
> -   需要持久化狀態

### 例子

```js
// stores/useMessageStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessageStore = defineStore("message", () => {
    const message = ref("來自 Pinia 的訊息");
    return { message };
});
```

```js
<!-- GrandChild.vue -->
<script setup>
import { useMessageStore } from "../stores/useMessageStore";

const messageStore = useMessageStore();
</script>

<template>
  <div>
    <h4>孫元件</h4>
    <p>來自父元件的訊息：{{ messageStore.message }}</p>
  </div>
</template>
```

✅ **優點**：

-   適合大型應用，不只是 props，還可以用來管理 API 資料、使用者狀態
-   資料可跨頁面存取

❌ **缺點**：

-   需要額外的 store 管理
