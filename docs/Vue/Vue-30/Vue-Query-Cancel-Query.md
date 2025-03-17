---
title: "[vue] 使用 cancelQuery 來取消 API 請求"

keywords: [Vue3, tanstack, useQuery, cancelQuery, 取消請求]

description: "透過 Vue Query 的 cancelQuery，手動或自動取消 API 請求，提升效能與使用者體驗"

author: WeiYun0912

og:title: "[vue] 使用 cancelQuery 來取消 API 請求"

og:description: "透過 Vue Query 的 cancelQuery，手動或自動取消 API 請求，提升效能與使用者體驗"

sidebar_position: 8
---

# 使用 `cancelQuery` 來取消 API 請求

## **簡介**

在某些情況下，我們可能需要 **取消 API 請求**，例如：

-   **切換頁面時，不再需要當前的 API 結果**
-   **使用者發送新請求，舊請求就不再需要**
-   **請求執行時間過長，允許使用者手動取消**

Vue Query 提供 `cancelQuery` 讓我們可以手動或自動取消 API 請求，以提升效能並避免不必要的資源浪費。

---

## **使用 `cancelQuery` 自動取消請求**

Vue Query 會自動為 `queryFn` 提供 `signal`，當請求不再需要時 (例如頁面切換或重新請求)，請求將被取消。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async ({ signal }) => {
    const { data } = await axios.get("http://localhost:3000/todos", { signal });
    return data;
};

const { data, isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
});
</script>

<template>
    <div>
        <h2>待辦事項</h2>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError" style="color: red">請求失敗</p>
        <ul v-else>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

---

## **手動取消 API 請求**

如果請求過長，使用者可以手動取消 API 請求。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const queryClient = useQueryClient();

const fetchTodos = async ({ signal }) => {
    const { data } = await axios.get("http://localhost:3000/todos", { signal });
    return data;
};

const { data, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
});

const cancelRequest = () => {
    queryClient.cancelQueries({ queryKey: ["todos"] });
};
</script>

<template>
    <div>
        <h2>待辦事項</h2>
        <button @click="cancelRequest">取消請求</button>
        <p v-if="isLoading">載入中...</p>
        <ul>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

---

## **`cancelQuery` vs. `useQuery` 預設行為**

|                      | `useQuery` 預設行為      | `cancelQuery`                    |
| -------------------- | ------------------------ | -------------------------------- |
| **是否自動取消請求** | ❌ 預設不會取消          | ✅ 自動取消或手動取消            |
| **適用場景**         | 請求發送後一定要獲取結果 | 切換頁面或發送新請求時取消舊請求 |

---

## **小小小小總結**

-   **`cancelQuery` 允許我們手動或自動取消 API 請求，避免浪費資源**
-   **適用於頁面切換或使用者手動取消請求的場景**
-   **當 `queryFn` 接收 `signal` 時，Vue Query 可自動取消請求**
