---
title: "[vue] Vue Render Function"
keywords: [vue3, vue]
description: 在 Vue 3 開發中，我們大多數時候都使用**單檔案元件**（SFC，Single File Component）來開發 UI。但在某些情境下，使用**渲染函式**（Render Function）可以提供更大的靈活性，甚至解決一些難以用模板（template）實現的需求。
author: WeiYun0912
og:title: "[vue] Vue Render Function"
og:description: "[vue] 在 Vue 3 開發中，我們大多數時候都使用**單檔案元件**（SFC，Single File Component）來開發 UI。但在某些情境下，使用**渲染函式**（Render Function）可以提供更大的靈活性，甚至解決一些難以用模板（template）實現的需求。"
---

# Vue Render Function

## 簡介

在 Vue 3 開發中，我們大多數時候都使用**單檔案元件**（SFC，Single File Component）來開發 UI。但在某些情境下，使用**渲染函式**（Render Function）可以提供更大的靈活性，甚至解決一些難以用模板（template）實現的需求。

## 使用 Render Function 的時機

-   需要根據 JSON 結構動態產生 UI，例如後端 API 返回的資料是 JSON 格式，我們需要根據這些資料動態產生 UI
-   避免過度使用 v-if / v-for，即需要在 template 中使用多個條件判斷時

## 傳統模板寫法與其缺點

假設我們有一個 JSON 結構，想要渲染一個動態表單，使用傳統模板寫法：

```javascript
<script setup>
const formSchema = [
    { type: "text", placeholder: "輸入姓名" },
    { type: "email", placeholder: "輸入 Email" },
    { type: "select", options: ["選項 A", "選項 B", "選項 C"] },
];
</script>

<template>
    <form>
        <div v-for="(field, index) in formSchema" :key="index">
            <input v-if="field.type === 'text'" type="text" :placeholder="field.placeholder" />
            <input v-else-if="field.type === 'email'" type="email" :placeholder="field.placeholder" />
            <select v-else-if="field.type === 'select'">
                <option v-for="option in field.options" :key="option" :value="option">
                    {{ option }}
                </option>
            </select>
        </div>
    </form>
</template>
```

### 這種寫法的缺點

1. 過多的 `v-if` 和 `v-else-if` 使程式碼難以維護
2. 每種類型都需要單獨的條件判斷
3. 當需要支援更多輸入類型時，模板會變得越來越複雜

## h 函式介紹

`h` 函式是 Vue 的 Render Function 中的核心函式，用於生成虛擬 DOM (virtual DOM)，類似於 React 的 `React.createElement`。

```javascript
<script setup>
import { h } from "vue";

// Render Function
const renderContent = () => {
    return h("div", { class: "box" }, "Hello World");
};
</script>

<template>
    <component :is="renderContent()" />
</template>
```

這段程式碼會在頁面上渲染：

```html
<div class="box">Hello World</div>
```

## 使用 Render Function 改寫動態表單

```javascript
<script setup>
import { h } from "vue";

const formSchema = [
    { type: "text", placeholder: "輸入姓名" },
    { type: "email", placeholder: "輸入 Email" },
    { type: "select", options: ["選項 A", "選項 B", "選項 C"] },
];

const renderForm = () => {
    return formSchema.map((field) => {
        if (field.type === "text" || field.type === "email") {
            return h("input", {
                type: field.type,
                placeholder: field.placeholder,
            });
        } else if (field.type === "select") {
            return h(
                "select",
                field.options.map((option) => h("option", { value: option }, option))
            );
        }
    });
};
</script>

<template>
    <form>
        <component :is="renderForm" />
    </form>
</template>
```

### 使用 Render Function 的優點

1. 只需修改 `formSchema`，無需更改模板即可支援新的輸入類型
2. 可以動態決定要渲染的標籤（如 input、textarea 等）
3. 渲染邏輯集中在 `renderForm` 函式中，便於測試與維護
4. 不影響模板的可讀性

## 配合 Slot 使用 Render Function

### Card 元件 (Card.vue)

```javascript
<script setup>
import { h, useSlots } from "vue";

const slots = useSlots();

// Render Function
const renderCard = () => {
    return h("div", { class: "card" }, [
        h("div", { class: "header" }, slots.header ? slots.header() : "無標題"),
        h("div", { class: "content" }, slots.content ? slots.content() : "無內容"),
        h("div", { class: "footer" }, slots.footer ? slots.footer() : "無按鈕"),
    ]);
};
</script>

<template>
    <component :is="renderCard()" />
</template>
```

### 使用 Card 元件

```javascript
<script setup>
import { h } from "vue";
import Card from "./components/Card.vue";
</script>

<template>
    <Card>
        <template #header><h2>標題</h2></template>
        <template #content>這是主要內容</template>
        <template #footer><button>確認</button></template>
    </Card>
</template>
```

## 不適合使用 Render Function 的情況

-   **簡單渲染**：如果只是簡單的一兩個 v-for 循環，使用 Render Function 可能會讓程式碼變得更難理解
-   **複雜嵌套**：如果 Render Function 嵌套過深，可能讓 UI 渲染邏輯變得難以維護
-   **指令限制**：在 Render Function 中無法直接使用 v-if、v-for、v-model 等指令，需要通過程式邏輯來實現

這邊也用 GPT 總結一下優缺

| 情境                        | 適合 h()？ | 原因                               |
| --------------------------- | ---------- | ---------------------------------- |
| 後端回傳 JSON，動態產生 UI  | ✅ 適合    | 內容是變動的，不能硬寫模板         |
| CMS，管理員決定顯示哪些區塊 | ✅ 適合    | 不能預先知道會顯示哪些內容         |
| 元件類型/標籤是動態變化的   | ✅ 適合    | 可能是 h1 也可能是 p，需要動態決定 |
| 靜態表單，內容固定          | ❌ 不適合  | 直接用 template 比較清楚           |
| 少量條件判斷（如 v-if）     | ❌ 不適合  | v-if 更直覺                        |

## 參考資料

-   [Vue 3 官方文檔 - Render Function](https://vuejs.org/guide/extras/render-function)
