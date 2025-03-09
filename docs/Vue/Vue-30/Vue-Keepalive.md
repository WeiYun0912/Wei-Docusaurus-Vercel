---
title: "[vue] 使用 KeepAlive 讓元件保持狀態，避免重置"

keywords: [vue3, KeepAlive, 動態組件, 緩存元件, Vue Router]

description: KeepAlive 是 Vue 內建的組件，可以緩存動態元件，避免組件切換時重新渲染。本篇介紹 KeepAlive 的使用方式、適用場景、與常見問題。

author: WeiYun0912

og:title: "[vue] 使用 KeepAlive 讓元件保持狀態，避免重置"

og:description: "[vue] KeepAlive 是 Vue 內建的組件，可以緩存動態元件，避免組件切換時重新渲染。本篇介紹 KeepAlive 的使用方式、適用場景、與常見問題。"
---

# Vue KeepAlive

## 簡介

Vue 內建的 `<KeepAlive>` 元件允許我們快取動態元件，避免切換元件時，元件的狀態被重置。

通常在 Vue 中，當一個動態元件或頁面 `被切換時`，它的 `狀態`會被 `銷毀（Unmount）`

例如：

-   切換 Tab 時，輸入框的內容會消失
-   頁面來回切換時，每次都要重新請求 API
-   Vue Router 切換頁面時，表單數據會重置

這時候我們就可以使用 `<KeepAlive>` 元件來避免這個問題，讓元件的狀態被保留，避免重置。

## 不使用 KeepAlive 的狀況

假設我們有兩個元件，分別是 `ComponentA` 和 `ComponentB`，我們希望在切換元件時，元件的狀態被保留，就可以使用 `<KeepAlive>` 元件來實現。

先來看不使用 `<KeepAlive>` 的狀況，在 `ComponentA.vue` 和 `ComponentB.vue` 中，我們都有一個輸入框，當我們在 `App.vue` 切換元件時，輸入框的值會被重置。

這邊先用簡單的 Tab 切換來示範

<!-- prettier-ignore -->
```html
<script setup>
import { ref } from "vue";
import ComponentA from "./components/ComponentA.vue";
import ComponentB from "./components/ComponentB.vue";

const tab = ref("A");

const toggleTab = () => {
    tab.value = tab.value === "A" ? "B" : "A";
};
</script>
<template>
    <div>
        <ComponentA v-if="tab === 'A'" />
        <ComponentB v-if="tab === 'B'" />

        <button @click="toggleTab">切換</button>
    </div>
</template>
```

<!-- prettier-ignore -->
```html
<script setup>
import { ref } from "vue";
const inputValue = ref("");
</script>

<template>
    <div>
        <h1>Component A</h1>
        <input type="text" v-model="inputValue" />
    </div>
</template>
```

<!-- prettier-ignore -->
```html
<script setup>
import { ref } from "vue";
const inputValue = ref("");
</script>

<template>
    <div>
        <h1>Component B</h1>
        <input type="text" v-model="inputValue" />
    </div>
</template>
```

## 使用 KeepAlive 的狀況

使用 `<KeepAlive>` 元件後，當我們切換元件時，輸入框的值會被保留，我們只需要在使用 `ComponentA` 和 `ComponentB` 的元件中，使用 `<KeepAlive>` 元件包住即可。

<!-- prettier-ignore -->
```html
<script setup>
import { ref } from "vue";
import ComponentA from "./components/ComponentA.vue";
import ComponentB from "./components/ComponentB.vue";

const tab = ref("A");

const toggleTab = () => {
    tab.value = tab.value === "A" ? "B" : "A";
};
</script>

<template>
    <div>
        <KeepAlive>
            <ComponentA v-if="tab === 'A'" />
        </KeepAlive>
        <KeepAlive>
            <ComponentB v-if="tab === 'B'" />
        </KeepAlive>

        <button @click="toggleTab">切換</button>
    </div>
</template>
```

但如果我們的 `Tab` 有很多，每次都要寫這麼多 `<KeepAlive>` 元件，會覺得很麻煩，所以這時候我們可以使用 `<component>` 元件的 `is` 屬性來動態切換元件。

<!-- prettier-ignore -->
```html
<script setup>
import { ref } from "vue";
import ComponentA from "./components/ComponentA.vue";
import ComponentB from "./components/ComponentB.vue";
const activeComponent = ref(ComponentA);

const toggleTab = () => {
    activeComponent.value = activeComponent.value === ComponentA ? ComponentB : ComponentA;
};
</script>
<template>
    <div>
        <KeepAlive>
            <component :is="activeComponent" />
        </KeepAlive>

        <button @click="toggleTab">切換</button>
    </div>
</template>
```

這時候會發現為什麼 `toggleTab` 按下去以後，沒有切換元件，這是因為使用 `ref` 包裝 Vue 元件時，它會嘗試使元件變成響應式，但 Vue 元件本身是複雜物件，內部包含各種方法和屬性，不適合被完全轉換為響應式。

所以這時候我們可以改使用 `shallowRef`，因為它只會使頂層（即 .value 屬性）變成響應式，而不會嘗試深入轉換組件內部的結構。這對於元件引用特別適合，因為我們只需要追蹤元件的引用變化，而不需要追蹤元件 `內部結構`的變化。

<!-- prettier-ignore -->
```html
<script setup>
import { ref, shallowRef } from "vue";
import ComponentA from "./components/ComponentA.vue";
import ComponentB from "./components/ComponentB.vue";
const activeComponent = shallowRef(ComponentA);

const toggleTab = () => {
    activeComponent.value = activeComponent.value == ComponentA ? ComponentB : ComponentA;
};
</script>
<template>
    <div>
        <KeepAlive>
            <component :is="activeComponent" />
        </KeepAlive>

        <button @click="toggleTab">切換</button>
    </div>
</template>
```

## 選擇性快取

在 `<KeepAlive>` 元件中，我們可以透過 `include` 和 `exclude` 屬性並輸入元件的 `name` 來控制哪些元件需要被快取，這個 `name` 是 `ComponentA` 的 `name` 屬性。

:::tip
根據官方表示，在 Vue 3.2.34 或以上的版本中，使用 `<script setup>` 的單文件元件(SFC)會自動根據文件名稱生成對應的 `name` 選項，無需再手動聲明。
:::

![Image](https://i.imgur.com/YetbxED.png)

這樣寫就表示只有 `ComponentA` 會被快取，`ComponentB` 不會被快取。

<!-- prettier-ignore -->
```html
<script setup>
import { ref, shallowRef } from "vue";
import ComponentA from "./components/ComponentA.vue";
import ComponentB from "./components/ComponentB.vue";
const activeComponent = shallowRef(ComponentA);

const toggleTab = () => {
    activeComponent.value = activeComponent.value == ComponentA ? ComponentB : ComponentA;
};
</script>
<template>
    <div>
        <KeepAlive include="ComponentA">
            <component :is="activeComponent" />
        </KeepAlive>

        <button @click="toggleTab">切換</button>
    </div>
</template>
```

`include` 和 `exclude` 也可以使用 `正則表達式`或 `陣列`來控制哪些元件需要被快取，例如：

<!-- prettier-ignore -->
```html
<script setup>
import { ref, shallowRef } from "vue";
import ComponentA from "./components/ComponentA.vue";
import ComponentB from "./components/ComponentB.vue";
const activeComponent = shallowRef(ComponentA);

const toggleTab = () => {
    activeComponent.value = activeComponent.value == ComponentA ? ComponentB : ComponentA;
};
</script>
<template>
    <div>
        <!-- 使用正則表達式 這樣寫只會快取元件名稱內有 'A' 的元件 -->
        <KeepAlive :include="/A/">
            <component :is="activeComponent" />
        </KeepAlive>

        <!-- 使用陣列 這樣寫只會快取 ComponentA 和 ComponentB -->
        <KeepAlive :include="['ComponentA', 'ComponentB']">
            <component :is="activeComponent" />
        </KeepAlive>

        <button @click="toggleTab">切換</button>
    </div>
</template>
```

## KeepAlive 的生命週期

當元件進入 `KeepAlive` 時，`onMounted` 不會再次執行，而是觸發 `onActivated`，當元件被切換出去時，不會銷毀，而是觸發 `onDeactivated`。

這邊要注意的是，`onActivated` 和 `onDeactivated` 只有在 `KeepAlive` 元件中才會觸發，如果沒有使用 `KeepAlive` 元件，則不會觸發，且 `onMounted` 只會觸發一次。

<!-- prettier-ignore -->
```html
<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from "vue";
const inputValue = ref("");

onActivated(() => {
    console.log("Component A 已啟動");
});
onDeactivated(() => {
    console.log("Component A 已停用");
});

onMounted(() => {
    console.log("Component A 已掛載");
});
onUnmounted(() => {
    // 不會執行
    console.log("Component A 已卸載");
});
</script>

<template>
    <div>
        <h1>Component A</h1>
        <input type="text" v-model="inputValue" />
    </div>
</template>
```

<!-- prettier-ignore -->
```html
<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from "vue";
const inputValue = ref("");

onActivated(() => {
    console.log("Component A 已啟動");
});
onDeactivated(() => {
    console.log("Component A 已停用");
});

onMounted(() => {
    console.log("Component A 已掛載");
});
onUnmounted(() => {
    // 不會執行
    console.log("Component A 已卸載");
});
</script>

<template>
    <div>
        <h1>Component A</h1>
        <input type="text" v-model="inputValue" />
    </div>
</template>
```

來會切換的話會長這樣

![Image](https://i.imgur.com/67BjyuL.png)

## 參考資料

-   [Vue KeepAlive](https://cn.vuejs.org/guide/built-ins/keep-alive)
