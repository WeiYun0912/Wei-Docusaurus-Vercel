---
title: "[vue] Vue Query 介紹： 使用 Parallel Queries 來處理動態查詢"

keywords: [Vue3, tanstack, useQuery, useQueries, 平行查詢]

description: "透過 Vue Query 的 Parallel Queries，同時執行多個 API 查詢，提高效能與使用者體驗"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹： 使用 Parallel Queries 來處理動態查詢"

og:description: "透過 Vue Query 的 Parallel Queries，同時執行多個 API 查詢，提高效能與使用者體驗"

sidebar_position: 29
---

# 使用 `Parallel Queries` 來處理動態查詢

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## 簡介

在開發 Vue 應用時，經常會遇到 **多個 API 查詢** 需要 **同時執行** 的情況，例如：

-   **同時載入「使用者」、「專案」與「團隊」資訊**
-   **一次查詢多個用戶的詳細資料**
-   **提高效能，避免不必要的請求延遲**

Vue Query 提供 **Parallel Queries** 來 **平行執行多個 API 查詢**，讓畫面載入更快、更流暢。

---

## 手動平行查詢

當我們 `已知 API 查詢數量是固定的`，可以使用多個 `useQuery`，每個 `useQuery` 都會獨立發送請求。

-   查詢數量固定，不會變動（例如 usersQuery、teamsQuery 和 projectsQuery 永遠只有這 3 個 API）。
-   查詢的 key 是手動指定的，每個 API 需要單獨使用 useQuery。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchUsers = async () => (await axios.get("http://localhost:3002/users")).data;
const fetchTeams = async () => (await axios.get("http://localhost:3002/teams")).data;
const fetchProjects = async () => (await axios.get("http://localhost:3002/projects")).data;

// 多個 API 查詢平行執行
const usersQuery = useQuery({ queryKey: ["users"], queryFn: fetchUsers });
const teamsQuery = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
</script>
```

## 動態平行查詢

當查詢的數量 **會變動** (例如：依據使用者清單查詢多個使用者詳細資料)，就不能手動宣告 `useQuery`，而應該要使用 `useQueries`。

-   查詢數量是動態的（例如 users 陣列可能有 3 個、5 個甚至 10 個使用者，每個使用者都需要查詢 API）。
-   queryKey 會根據 users 陣列變化動態生成。
-   可以避免違反 Hooks 規則（因為 useQuery 不能在條件語句或迴圈中使用，但 useQueries 可以）。
-   類似 Promise.all 的用法。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { useQueries } from "@tanstack/vue-query";
import { computed } from "vue";
import axios from "axios";

const users = computed(() => [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
]);

const fetchUserById = async (id) => (await axios.get(`http://localhost:3002/users/${id}`)).data;

const queries = computed(() =>
    users.value.map((user) => ({
        queryKey: ["user", user.id],
        queryFn: () => fetchUserById(user.id),
    }))
);

const userQueries = useQueries({ queries });
</script>

<template>
    <div>
        <h2>動態平行查詢範例</h2>
        <ul>
            <li v-for="query in userQueries" :key="query.data?.id">
                {{ query.data?.name || "載入中..." }}
            </li>
        </ul>
    </div>
</template>
```

![Image](https://i.imgur.com/XqAwwIP.png)

## `useQuery` vs. `useQueries` 差異

|              | `useQuery`              | `useQueries`                    |
| ------------ | ----------------------- | ------------------------------- |
| **適用場景** | 固定數量的 API 查詢     | 動態數量的 API 查詢             |
| **查詢方式** | 手動宣告多個 `useQuery` | 傳遞陣列給 `useQueries`         |
| **優勢**     | 易讀易寫，適合靜態查詢  | 適合動態清單，不違反 Hooks 規則 |

---

## 總結

-   **`Parallel Queries` 讓我們可以同時執行多個 API 查詢，提升載入效能**
-   **適用於多個 API 查詢的場景，如「使用者、專案、團隊」等資訊同步載入**
-   **靜態查詢可使用多個 `useQuery`，動態查詢則應使用 `useQueries`**
