---
title: "[vue] Vue Query 介紹： 使用 useMutation 進行樂觀更新 (Optimistic Updates)"

keywords: [Vue3, tanstack, useMutation, Optimistic Updates]

description: "透過 Vue Query 的 useMutation 進行樂觀更新，提升 API 資料變更時的使用者體驗"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹： 使用 useMutation 進行樂觀更新 (Optimistic Updates)"

og:description: "透過 Vue Query 的 useMutation 進行樂觀更新，提升 API 資料變更時的使用者體驗"

sidebar_position: 6
---

# 使用 `useMutation` 進行樂觀更新 (Optimistic Updates)

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## **簡介**

在處理 API **新增、修改或刪除** 操作時，使用者通常會遇到以下問題：

-   **等待 API 回應時，畫面沒有立即反應，導致體驗不流暢**。
-   **請求失敗時，UI 需要回滾 (Rollback)，但手動處理較繁瑣**。
-   **在多個組件內部顯示相同的資料時，如何讓 UI 立即同步變更？**

這時候，**Vue Query 提供的 `useMutation` 搭配樂觀更新 (Optimistic Updates)**，可以讓 UI **先更新**，再等待 API 回應。

依我工作的經驗蠻常遇到這個問題，因為我們後端的 `node` 還需要發送請求到 `python` 處理資料，所以會有蠻大的延遲，這時候如果可以先讓 UI 更新，再等待後端回應，可以提升使用者體驗。

要看到效果的話，建議開 F12 的 DevTools，把 Network 的 Throttling 調整為 `3G`，這樣可以看到明顯的延遲，測試完記得調回 `No throttling`。

![Image](https://i.imgur.com/Mj5beOh.png)

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

## Mutation 與 Query 在同元件

如果我們的 `Mutation` 和 `Query` 都在同個元件的話，可以讓 UI 直接渲染 `isPending` 或 `isError` 來反應變更。

以下程式碼的說明：

-   新增時 UI 立即顯示一筆新的項目 (opacity 0.5)，等 API 回應後變為正式資料，這邊透過 `isPending` 來判斷是否顯示。
-   `Mutation` 失敗時 UI 自動刪除該項目，並提供「重試」按鈕。
-   適用於單一元件內部處理 `Mutation` 與 `Query`。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const queryClient = useQueryClient();
const newTodoTitle = ref("");

const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:3002/todos");
    return data;
};

const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
});

const {mutate,isPending, isError, variables} = useMutation({
    mutationFn: async (newTodo) => {
        const { data } = await axios.post("http://localhost:3002/todos", newTodo);
        return data;
    },
    onSettled: async () => {
        return await queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
});

const addTodo = () => {
    if (!newTodoTitle.value) return;
    mutate({ title: newTodoTitle.value });
    newTodoTitle.value = "";
};
</script>

<template>
    <div>
        <h2>待辦事項</h2>
        <input v-model="newTodoTitle" placeholder="輸入新的待辦事項" />
        <button @click="addTodo" :disabled="isPending">
            {{ isPending ? "新增中..." : "新增" }}
        </button>

        <ul>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
            <li v-if="isPending" style="opacity: 0.5">{{ variables?.title }}</li>
        </ul>

        <p v-if="isError" style="color: red">新增失敗！<button @click="mutate(variables)">重試</button></p>
    </div>
</template>
```

## 透過快取進行樂觀更新

這種方式適用於 `Mutation` 與 `Query` 在不同元件內，但我們方便 Demo 所以這邊會在同個元件內進行。

以下程式碼的說明：

-   `Mutation` 發送時，先暫停 `todos` 的 `快取更新 (cancelQueries)`，防止 API 回應覆蓋 UI，詳細的說明可以看[影片](https://youtu.be/I-qGvLln-pg?si=sRYTPOmh6n9FYG5z&t=176)。
-   `Mutation` 成功時，直接透過 `setQueryData` 更新快取，確保 UI 立即同步。
-   `Mutation` 失敗時，`還原 (rollback)` 原始資料，確保 UI 不顯示錯誤資訊。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { ref } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const queryClient = useQueryClient();
const newTodoTitle = ref("");

const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:3002/todos");
    return data;
};

const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
});

const { mutate, isPending, isError } = useMutation({
    mutationFn: async (newTodo) => {
        const { data } = await axios.post("http://localhost:3002/todos", newTodo);
        return data;
    },
    onMutate: async (newTodo) => {
        await queryClient.cancelQueries({ queryKey: ["todos"] });

        const previousTodos = queryClient.getQueryData(["todos"]);

        queryClient.setQueryData(["todos"], (old) => [...old, { id: Date.now(), ...newTodo }]);

        return { previousTodos };
    },
    onError: (err, newTodo, context) => {
        queryClient.setQueryData(["todos"], context.previousTodos);
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
});

const addTodo = () => {
    if (!newTodoTitle.value) return;
    mutate({ title: newTodoTitle.value });
    newTodoTitle.value = "";
};
</script>

<template>
    <div>
        <h2>待辦事項</h2>
        <input v-model="newTodoTitle" placeholder="輸入新的待辦事項" />
        <button @click="addTodo" :disabled="isPending">
            {{ isPending ? "新增中..." : "新增" }}
        </button>

        <ul>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
        </ul>

        <p v-if="isError" style="color: red">新增失敗！</p>
    </div>
</template>
```
