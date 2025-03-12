---
title: "[vue] Vue Query 介紹： 使用 placeholderData 與 keepPreviousData 提升分頁體驗"

keywords: [Vue3, tanstack, useQuery, 分頁, placeholderData, keepPreviousData]

description: "透過 Vue Query 的 placeholderData 與 keepPreviousData，提升 API 分頁的使用體驗"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹： 使用 placeholderData 與 keepPreviousData 提升分頁體驗"

og:description: "透過 Vue Query 的 placeholderData 與 keepPreviousData，提升 API 分頁的使用體驗"

sidebar_position: 5
---

# 使用 placeholderData 與 keepPreviousData 提升分頁體驗

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## **簡介**

在開發分頁 API 時，使用者在切換頁數時 **可能會遇到閃爍**，因為：

-   **API 請求回應有延遲**，導致畫面會短暫沒有資料 (白屏)。
-   **切換頁面時資料會瞬間消失**，影響使用者體驗。

Vue Query 提供了 **`placeholderData`** 和 **`keepPreviousData`** 兩種方式，來讓使用者在分頁時有更順暢的體驗：

1. **`placeholderData`**：在新數據載入前，先顯示預設數據 (例如上一頁的數據)。
2. **`keepPreviousData`**：當 API 正在加載時，維持前一頁的數據，避免畫面閃爍。

---

## **設定 JSON Server 作為測試 API**

如果還沒安裝 **JSON Server** 的，可以參考一下[影片](https://youtu.be/7MDI54nlEbc?si=KlXJvV4NCLtZkPJa&t=135)。

```bash
npx json-server --watch db.json --port 3002
```

然後在 `db.json` 中新增幾筆 `todos` 資料：

```json
{
    "todos": [
        { "id": 1, "title": "待辦事項 1" },
        { "id": 2, "title": "待辦事項 2" },
        { "id": 3, "title": "待辦事項 3" },
        { "id": 4, "title": "待辦事項 4" },
        { "id": 5, "title": "待辦事項 5" },
        { "id": 6, "title": "待辦事項 6" },
        { "id": 7, "title": "待辦事項 7" },
        { "id": 8, "title": "待辦事項 8" },
        { "id": 9, "title": "待辦事項 9" },
        { "id": 10, "title": "待辦事項 10" }
    ]
}
```

現在我們可以透過 `http://localhost:3002/todos?_page=1&_limit=5` 來取得分頁資料。

---

## 不使用 placeholderData 與 keepPreviousData 的狀況

現在先來看看不使用 `placeholderData` 與 `keepPreviousData` 的狀況，將以下程式碼複製到 `Todos.vue` 中：

<!-- prettier-ignore -->
```html title='Todos.vue' showLineNumbers
<script setup>
import { ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const page = ref(1);
const limit = 3; // 每頁 3 筆

const fetchTodos = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const { data } = await axios.get(`http://localhost:3002/todos?_page=${page}&_limit=${limit}`);
    return data;
};

const { data, isLoading, isFetching } = useQuery({
    queryKey: ["todos", page],
    queryFn: fetchTodos,
});

const nextPage = () => {
    if (!isFetching.value) page.value++;
};
const prevPage = () => {
    if (page.value > 1 && !isFetching.value) page.value--;
};
</script>

<template>
    <div>
        <h2>待辦事項 (分頁 API)</h2>
        <p v-if="isLoading">載入中...</p>
        <ul>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>

        <button @click="prevPage" :disabled="page === 1">上一頁</button>
        <button @click="nextPage" :disabled="isFetching">下一頁</button>

        <p v-if="isFetching">載入新頁面資料中...</p>
    </div>
</template>
```

然後按下 F12 開啟 DevTools，把 `Network` 的 `Throttle` 調整為 `3G`，這樣可以模擬網路較差時的狀況，也就可以看到當我們按下 `下一頁` 切換頁面時，整個當前渲染的資料會消失，直到資料載入完成後，才會重新渲染新的資料。

![Image](https://i.imgur.com/aMBr1XJ.png)

![Image](https://i.imgur.com/54pdd0c.gif)

## 使用 placeholderData 與 keepPreviousData 提升分頁體驗

現在我們來看看使用 `placeholderData` 與 `keepPreviousData` 的狀況，使用的方式很簡單，只要在 `useQuery` 的 `options` 中加入 `placeholderData` 與 `keepPreviousData` 即可，將以下程式碼複製到 `Todos.vue` 中：

<!-- prettier-ignore -->
```html title='Todos.vue' showLineNumbers
<script setup>
import { ref } from "vue";
import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import axios from "axios";

const page = ref(1);
const limit = 3; // 每頁 3 筆

const fetchTodos = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const { data } = await axios.get(`http://localhost:3002/todos?_page=${page}&_limit=${limit}`);
    return data;
};

const { data, isLoading, isFetching } = useQuery({
    queryKey: ["todos", page],
    queryFn: fetchTodos,
    placeholderData: keepPreviousData,
});

const nextPage = () => {
    if (!isFetching.value) page.value++;
};
const prevPage = () => {
    if (page.value > 1 && !isFetching.value) page.value--;
};
</script>

<template>
    <div>
        <h2>待辦事項 (分頁 API)</h2>
        <p v-if="isLoading">載入中...</p>
        <ul>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>

        <button @click="prevPage" :disabled="page === 1">上一頁</button>
        <button @click="nextPage" :disabled="isFetching">下一頁</button>

        <p v-if="isFetching">載入新頁面資料中...</p>
    </div>
</template>
```

![Image](https://i.imgur.com/7M1ashU.gif)

## 注意事項

當我們使用了 `placeholderData` 與 `keepPreviousData` 時，`isLoading` 只有一開始會是 `true`，當資料載入完成後，`isLoading` 會變成 `false`，即使我們切換頁面時，`isLoading` 也不會變成 `true`，這時候我們可以透過 `isPlaceholderData` 來取代 `isLoading`，來達到更好的體驗。

<!-- prettier-ignore -->
```html title='Todos.vue' showLineNumbers
<script setup>
import { ref } from "vue";
import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import axios from "axios";

const page = ref(1);
const limit = 3; // 每頁 3 筆

const fetchTodos = async ({ queryKey }) => {
    const [_key, page] = queryKey;
    const { data } = await axios.get(`http://localhost:3002/todos?_page=${page}&_limit=${limit}`);
    return data;
};

const { data, isLoading, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["todos", page],
    queryFn: fetchTodos,
    placeholderData: keepPreviousData,
});

const nextPage = () => {
    if (!isFetching.value) page.value++;
};
const prevPage = () => {
    if (page.value > 1 && !isFetching.value) page.value--;
};
</script>

<template>
    <div>
        <h2>待辦事項 (分頁 API)</h2>
        <!-- 換成 isPlaceholderData 來取代 isLoading -->
        <p v-if="isPlaceholderData">載入中...</p>
        <ul>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>

        <button @click="prevPage" :disabled="page === 1">上一頁</button>
        <button @click="nextPage" :disabled="isFetching">下一頁</button>

        <p v-if="isFetching">載入新頁面資料中...</p>
    </div>
</template>
```

## 參考資料

-   [Vue Query 官方文件](https://tanstack.com/query/latest/docs/framework/vue/guides/placeholder-query-data)
