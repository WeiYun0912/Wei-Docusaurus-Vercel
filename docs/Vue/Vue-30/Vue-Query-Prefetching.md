---
title: "[vue] Vue Query 介紹： 使用 prefetchQuery 來預先載入資料"

keywords: [Vue3, tanstack, useQuery, prefetchQuery, 預取資料]

description: "透過 Vue Query 的 prefetchQuery，提前載入 API 資料，提升使用者體驗"

author: WeiYun0912

og:title: "[vue] 使用 prefetchQuery 來預先載入資料"

og:description: "透過 Vue Query 的 prefetchQuery，提前載入 API 資料，提升使用者體驗"

sidebar_position: 27
---

import Giscus from "@site/src/components/GiscusComponent"

# 使用 `prefetchQuery` 來預先載入資料

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## **簡介**

當使用者瀏覽網頁時，API 請求通常是在 **進入該頁面時才觸發**，但有時我們 **已經知道使用者接下來可能會點擊的內容**，這時可以 `提前載入資料 (Prefetching)`，讓使用者 `點擊時立即顯示內容`，讓使用者進入到頁面時，不會看到 `Loading` 的畫面。

### **適用場景**

-   切換頁面時，讓下一頁的資料已經準備好
-   滑鼠懸停 (hover) 時，提前載入內容
-   進行分頁時，預先載入下一頁的資料

Vue Query 提供 `prefetchQuery` 來 預先載入(prefetch) 並將資料儲存到快取，等使用者需要時，能夠 **立即顯示內容，而不需要等待 API**。

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
        { "id": 3, "title": "待辦事項 3" }
    ]
}
```

## **使用 `prefetchQuery` 預取資料**

當我們知道使用者即將前往某個頁面時，可以 **在點擊前就先載入 API 資料**，確保頁面加載時不會有延遲。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const queryClient = useQueryClient();

// 獲取待辦事項 API
const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:3002/todos");
    return data;
};

// 預取 API 資料
const prefetchTodos = async () => {
    await queryClient.prefetchQuery({
        queryKey: ["todos"],
        queryFn: fetchTodos,
    });
};

// 正常載入 todos
const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
});
</script>

<template>
    <div>
        <h2>待辦事項</h2>
        <button @mouseover="prefetchTodos">滑鼠移動到該元素時預載入</button>

        <p v-if="isLoading">載入中...</p>
        <ul v-else>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

---

## **`prefetchQuery` vs. `useQuery`**

|              | `prefetchQuery`                       | `useQuery`                        |
| ------------ | ------------------------------------- | --------------------------------- |
| **用途**     | 預先載入未來可能需要的資料            | 立即請求 API 取得資料             |
| **執行時機** | 可手動觸發 (`mouseover`, `click` 等)  | 在元件掛載 (`mounted`) 時自動執行 |
| **適用場景** | 可能用到但還沒用到的資料 (例如下一頁) | 當前畫面需要的資料                |

---

## **小小小總結**

-   `prefetchQuery` 可以讓我們提前載入 API 資料，減少 UI 延遲，提高使用者體驗
-   適合應用在滑鼠懸停 (hover) 或預測使用者行為來提前載入
-   在分頁應用中，可以提前載入下一頁的內容，避免畫面閃爍
-   可以設定適當的 `staleTime` 和 `gcTime` 來管理快取過期時間

<Giscus />
