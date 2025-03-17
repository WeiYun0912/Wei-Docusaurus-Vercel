---
title: "[vue] Vue Query 介紹： 使用 Dependent Queries 與 Disabling Queries"

keywords: [Vue3, tanstack, useQuery, Dependent Queries, Disabling Queries]

description: "透過 Vue Query 的 Dependent Queries 來處理依賴查詢，並使用 Disabling Queries 控制請求行為，提高效能與使用者體驗"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹： 使用 Dependent Queries 與 Disabling Queries"

og:description: "透過 Vue Query 的 Dependent Queries 來處理依賴查詢，並使用 Disabling Queries 控制請求行為，提高效能與使用者體驗"

sidebar_position: 10
---

# 使用 `Dependent Queries` 與 `Disabling Queries` 來優化 API 查詢

## **簡介**

在 Vue 應用開發中，可能會遇到以下需求：

-   **先獲取使用者資訊，再查詢對應的專案資料**
-   **根據 `userIds` 批量查詢多個使用者的訊息**
-   **避免 API 競爭問題，確保查詢順序正確**
-   **僅在特定條件滿足時才發送查詢請求**

Vue Query 提供 `Dependent Queries` 和 `Disabling Queries`，讓我們能夠靈活地控制查詢的觸發條件，提升效能並減少不必要的 API 請求。

---

## 依賴查詢 (Dependent Queries)

當查詢 **依賴於前一個查詢的結果** 時，可以使用 `enabled` 來控制是否執行。

以下程式碼為：

-   **先查詢 `user`，再查詢 `projects`**
-   **避免 `projects` 查詢在 `userId` 尚未獲取時執行**
-   **減少不必要的 API 呼叫，提高效能**

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import axios from "axios";

const getUserByEmail = async (email) => (await axios.get(`/api/user/${email}`)).data;
const getProjectsByUser = async (userId) => (await axios.get(`/api/projects/${userId}`)).data;

// 取得使用者資訊
const { data: user } = useQuery({
    queryKey: ["user", "test@example.com"],
    queryFn: () => getUserByEmail("test@example.com"),
});

const userId = computed(() => user.value?.id);
const enabled = computed(() => !!userId.value); // 只有當 userId 存在時才啟用

// 取得該使用者的專案 (依賴 `userId`)
const { data: projects } = useQuery({
    queryKey: ["projects", userId],
    queryFn: () => getProjectsByUser(userId.value),
    enabled, // 依賴 userId，只有 userId 存在時才會執行
});
</script>
```

## 停用查詢 (Disabling Queries)

如果我們不希望查詢在元件掛載時自動執行，例如：

-   **按鈕觸發查詢**
-   **表單輸入後才查詢**
-   **某些條件未滿足時不查詢**

這時可以使用 `enabled: false` 來 **停用查詢**，僅在 `refetch()` 才會發送查詢請求。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodoList = async () => (await axios.get("/api/todos")).data;

// 預設停用查詢，點擊按鈕後手動執行
const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodoList,
    enabled: false, // 停用查詢
});
</script>

<template>
    <div>
        <button @click="refetch">查詢 Todos</button>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError">查詢失敗</p>
        <ul v-else>
            <li v-for="todo in data" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

## 延遲查詢 (Lazy Queries)

`enabled` 也可以用來動態控制查詢何時執行，例如：

-   **當使用者輸入關鍵字後才執行查詢**
-   **只有當某個變數有值時才執行查詢**

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import { ref, computed } from "vue";
import axios from "axios";

const filter = ref(""); // 使用者輸入的篩選條件
const isEnabled = computed(() => !!filter.value); // 只有 filter 有值時才啟用

const fetchTodos = async (filter) => (await axios.get(`/api/todos?filter=${filter}`)).data;

// 只有當 filter 有值時才查詢
const { data } = useQuery({
    queryKey: ["todos", filter],
    queryFn: () => fetchTodos(filter.value),
    enabled: isEnabled,
});
</script>
```

---

## 總結

-   **`Dependent Queries` 適用於查詢之間有依賴的場景**
-   **`enabled` 讓我們可以靈活控制查詢執行時機**
-   **`Disabling Queries` 適用於按鈕觸發或使用者輸入條件後的查詢**
-   **透過 `Lazy Queries` 提升應用效能，減少不必要的請求**
