---
title: "[vue] Vue3 shallowRef 簡易介紹"

keywords: [Vue3, shallowRef, 效能]

description: "透過 Vue 3 的 shallowRef，提升效能"

author: WeiYun0912

og:title: "[vue] Vue3 shallowRef 簡易介紹"

og:description: "透過 Vue 3 的 shallowRef，提升效能"
---

# ** Vue 3 shallowRef 簡易介紹**

## 簡介

在 Vue 3 中，我們通常使用 `ref()` 來建立響應式變數，但 **當 `ref()` 內部是物件或陣列時，Vue 會深層追蹤所有屬性**，這可能會影響效能。

✅ **`shallowRef()` 只追蹤「變數本身」，不追蹤內部物件的變化**，適用於：

-   **大規模物件（API 回應資料、表格數據）**
-   **不希望 Vue 監聽內部屬性的情境**
-   **要手動控制更新的情境**

---

## **ref 和 shallowRef 的差異**

| **方法**       | **追蹤方式**                          | **適用情境**                           |
| -------------- | ------------------------------------- | -------------------------------------- |
| `ref()`        | **深層追蹤 (Deep Reactive)**          | 變數的內部屬性需要即時響應             |
| `shallowRef()` | **僅追蹤變數本身** (Shallow Reactive) | 變數內容較大、變動頻率低、希望手動更新 |

---

## **ref 的問題：深層追蹤導致效能影響**

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";

const user = ref({
    name: "Alice",
    age: 25,
});

const updateAge = () => {
    user.value.age += 1; // Vue 會深層監聽整個物件，影響效能
};
</script>

<template>
    <div>
        <p>姓名：{{ user.name }}</p>
        <p>年齡：{{ user.age }}</p>
        <button @click="updateAge">增加年齡</button>
    </div>
</template>
```

✅ `user.value.age` 變了，但 **Vue 仍會檢查 `user` 整個物件是否變更**，可能導致 **不必要的重新渲染**。

---

## **shallowRef 提升效能**

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { shallowRef } from "vue";

const user = shallowRef({
    name: "Alice",
    age: 25,
});

const updateAge = () => {
    user.value.age += 1; // ❌ Vue 不會自動重新渲染
};

const forceUpdate = () => {
    user.value = { ...user.value }; // ✅ 需要手動觸發更新
};
</script>

<template>
    <div>
        <p>姓名：{{ user.name }}</p>
        <p>年齡：{{ user.age }}</p>
        <button @click="updateAge">增加年齡（不會更新）</button>
        <button @click="forceUpdate">強制更新</button>
    </div>
</template>
```

✅ `shallowRef()` **內部屬性變更不會觸發 Vue 更新**，**需要手動更新變數**。

---

## **shallowRef 和 ref 的效能比較**

| **方法**       | **Vue 會自動追蹤內部屬性嗎？** | **適用場景**                       |
| -------------- | ------------------------------ | ---------------------------------- |
| `ref()`        | ✅ 是                          | 頻繁更新的小型物件                 |
| `shallowRef()` | ❌ 否                          | **大量資料、API 回應、手動更新時** |

---

## **何時該用 shallowRef？**

-   **API 回應（JSON 結構大，不希望 Vue 深度追蹤）**
-   **表格、清單數據（不希望每個改動都觸發 Vue 監聽）**
-   **手動控制何時更新畫面**
