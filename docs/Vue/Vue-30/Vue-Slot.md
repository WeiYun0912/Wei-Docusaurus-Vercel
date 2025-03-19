---
title: "[vue] Vue Slot 基本介紹"
keywords: [vue3, vue]
description: 在 Vue 3 開發中，我們可以透過 Slot 來建立可複用的元件，介紹一下 Slot 有幾種使用方式。
author: WeiYun0912
og:title: "[vue] Vue Slot 基本介紹"
og:description: "[vue] 在 Vue 3 開發中，我們可以透過 Slot 來建立可複用的元件，介紹一下 Slot 有幾種使用方式。"
sidebar_position: 7
---

import Giscus from "@site/src/components/GiscusComponent"

# Vue Slot

## 簡介

在 Vue 3 開發中，我們可以透過 `<slot>` 來建立可複用的元件，先簡單介紹一下 slot，這篇只會介紹最基本的用法。

假設我們要建立一個卡片元件，要根據傳入的 props 顯示不同的卡片，例如：圖片、標題、描述，該怎麼使用 slot 來實現，以及如果不使用 slot 該怎麼實現。

![Image](https://i.imgur.com/7EDfX17.png)

## 不使用 slot 實現

不使用 slot 實現的話，我們必須根據傳入的 props 來顯示不同的卡片，這裡我們必須考慮很多種情況，像是是否有媒體類型，媒體類型是否為圖片或影片、標題、描述，這樣的話我們的程式碼會變得很複雜。

程式寫起來就會像是這樣，看看這驚人的 props 數量，如果我們要再增加其他屬性，像是按鈕、連結等等，那我們的 props 數量就會爆炸。

```js title='ConditionalCard.vue' showLineNumbers
<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    hasMedia: {
        type: Boolean,
        required: true,
    },
    mediaType: {
        type: String,
    },
    mediaUrl: {
        type: String,
    },
    mediaAlt: {
        type: String,
    },
    contentType: {
        type: String,
        required: true,
    },
    contentText: {
        type: String,
    },
    customContent: {
        type: String,
    },
});
</script>
<template>
    <div class="card">
        <h2 class="card-title">{{ title }}</h2>
        <div class="card-content">
            <p v-if="contentType === 'text'">{{ contentText }}</p>
            <div v-else-if="contentType === 'custom'" v-html="customContent"></div>
        </div>

        <div class="card-media" v-if="hasMedia">
            <img v-if="mediaType === 'image'" :src="mediaUrl" :alt="mediaAlt" class="card-image" />
            <video v-else-if="mediaType === 'video'" :src="mediaUrl" controls></video>
        </div>
    </div>
</template>
```

在使用 ConditionalCard 元件的時候，就要傳入這些 props，來顯示不同的卡片。

```js title='App.vue' showLineNumbers
<ConditionalCard
    title="Hello World"
    :hasMedia="true"
    mediaType="image"
    mediaUrl="https://i.imgur.com/XPyLUv6.jpg"
    mediaAlt="Hello World"
    contentType="text"
    contentText="Hello World I'm a text"
/>
```

## 使用 slot 實現

要使用 slot 的話，我們需要先在元件中定義一個 `<slot>` 標籤，這樣的話我們就可以在元件中插入不同的內容。

```js title='SlotCard.vue' showLineNumbers
<template>
    <div class="card">
        <slot></slot>
    </div>
</template>
```

```js title='App.vue' showLineNumbers
<template>
    <SlotCard>
        <h1>Slot Card</h1>
    </SlotCard>
</template>
```

在畫面上的 DOM 則會長這樣

```html
<div class="card">
    <h1>Slot Card</h1>
</div>
```

## 預設值

如果我們想要預設內容的話，我們可以直接寫在 `slot` 底下，也就是當父元件沒有傳入內容時，就會顯示預設值。

```js title='SlotCard.vue' showLineNumbers
<template>
    <div class="card">
        <slot>
            <h1>我是預設值喔</h1>
        </slot>
    </div>
</template>
```

```js title='App.vue' showLineNumbers
<template>
    <SlotCard></SlotCard>
</template>
```

在畫面上的 DOM 則會長這樣

```html
<div class="card">
    <h1>我是預設值喔</h1>
</div>
```

## 命名 slot

如果我們想要傳入多個內容的話，我們可以透過命名 slot 來實現，這樣的話我們就可以在元件中插入不同的內容。

在 slot 上使用 `name` 屬性來命名

```js title='SlotCard.vue' showLineNumbers
<template>
    <div class="card">
        <h2 class="card-title">卡片標題</h2>

        <div class="card-content">
            <slot name="content">
                <!-- 默認內容 -->
                <p>卡片內容區域</p>
            </slot>
        </div>

        <div class="card-media">
            <slot name="media"></slot>
        </div>
    </div>
</template>
```

在父元件中使用 `template` 標籤來傳入內容，並且在 `template` 標籤上使用 `#` 來使用命名 slot。

```js title='App.vue' showLineNumbers
<template>
    <SlotCard title="卡片標題">
        <template #media>
            <img src="https://i.imgur.com/XPyLUv6.jpg" alt="卡片圖片" />
        </template>

        <template #content>
            <p>我是卡片內容我是卡片內容...</p>
        </template>
    </SlotCard>
</template>
```

這邊就算我們順序亂掉，也不會有影響，因為我們有命名 slot，所以就算順序不照著排，也不會有影響。

```js title='App.vue' showLineNumbers
<template>
    <SlotCard title="卡片標題">
        <!-- 把 content 的順序換過來 -->
        <template #content>
            <p>我是卡片內容我是卡片內容...</p>
        </template>

        <template #media>
            <img src="https://i.imgur.com/XPyLUv6.jpg" alt="卡片圖片" />
        </template>
    </SlotCard>
</template>
```

在畫面上的 DOM 則會長這樣，因為是照著我們的 `SlotCard.vue` 裡面的 `slot` 命名順序來顯示的。

```html
<div class="card">
    <h2 class="card-title">卡片標題</h2>

    <div class="card-content">
        <p>我是卡片內容我是卡片內容...</p>
    </div>

    <div class="card-media">
        <img src="https://i.imgur.com/XPyLUv6.jpg" alt="卡片圖片" />
    </div>
</div>
```

但實際的情況我們可能也會傳入 props，也就是傳入 props 跟 slot 是可以一起使用的。

在 `SlotCard` 傳入 `title` 屬性，並且在 `SlotCard` 裡面使用 `slot` 來顯示 `title` 屬性。

```js title='App.vue' showLineNumbers
<template>
    <SlotCard title="卡片標題">
        <template #content>
            <p>我是卡片內容我是卡片內容...</p>
        </template>
        <template #media>
            <img src="https://i.imgur.com/XPyLUv6.jpg" alt="產品圖片" />
         </template>
    </SlotCard>
</template>
```

```js title='SlotCard.vue' showLineNumbers
<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div class="card">
        <h2 class="card-title">{{ title }}</h2>

        <div class="card-content">
            <slot name="content">
                <!-- 默認內容 -->
                <p>卡片內容區域</p>
            </slot>
        </div>

        <div class="card-media">
            <slot name="media"></slot>
        </div>
    </div>
</template>
```

<Giscus />
