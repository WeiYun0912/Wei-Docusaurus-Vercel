---
title: "[vue] Vue Query 介紹： 使用 useMutation 來發送 API 請求"

keywords: [Vue3, tanstack, useMutation, API 更新, 非同步請求]

description: "useMutation 是 Vue Query 提供的 Hook，可用來處理非同步 API 變更，例如新增、更新與刪除"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹： 使用 useMutation 來發送 API 請求"

og:description: "useMutation 是 Vue Query 提供的 Hook，可用來處理非同步 API 變更，例如新增、更新與刪除"

sidebar_position: 24
---

# Vue Query 使用 useMutation 來處理 API 變更

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## 簡介

在 Vue 應用中，當我們需要 **新增、更新或刪除** API 資料時，傳統的做法通常是：

1. **發送 `POST`、`PUT` 或 `DELETE` 請求**。
2. **管理請求的 `loading` 狀態**，確保 UI 在請求進行中不會產生錯誤行為。
3. **處理請求的錯誤與成功狀態**，例如顯示錯誤訊息或通知用戶操作成功。
4. **手動更新前端狀態**，確保資料與後端同步。
5. **手動重新獲取 API 資料**，確保其他元件顯示最新的數據。

這種做法雖然可行，但當應用變大時，管理這些請求變得非常麻煩，這時 **Vue Query 的 `useMutation`** 就能幫上忙！

| 傳統方式                  | Vue Query useMutation  |
| ------------------------- | ---------------------- |
| 需要手動管理 loading 狀態 | 內建 isPending 狀態    |
| 需要手動處理錯誤          | 內建 onError 處理錯誤  |
| 需要手動更新快取          | onSuccess 自動更新快取 |
| 需要手動控制重試邏輯      | 內建 retry 機制        |

---

## 為什麼要使用 useMutation？

`useMutation` 主要解決 **非同步 API 變更的三大問題**：

-   **自動管理請求狀態**：提供 `isPending`、`isError`、`isSuccess` 等狀態，省去手動追蹤請求進行中的邏輯。
-   **內建錯誤處理與重試機制**：可以設定 `retry` 來自動重試請求，提升穩定性。
-   **自動更新快取**：可以在 API 成功後自動更新快取，減少不必要的 API 重新請求。

---

## `useMutation` 的基本用法

### 新增 Todo 資料

因為 `jsonplaceholder` 的 API 不允許我們新增資料，所以想要看到效果的可以自己架設 json-server 來測試，[影片也有提到](https://youtu.be/7MDI54nlEbc?si=KlXJvV4NCLtZkPJa&t=135)。

顯示資料一樣用上一篇的 `Todos.vue`，這邊就不重複了，只是把 API 改成 `json-server` 的 API。

<!-- prettier-ignore -->
```html title="Todos.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:3002/todos");
    return data;
};

const {
    data: todos,
    isLoading,
    isError,
} = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    gcTime: 3000,
});
</script>

<template>
    <div>
        {{ isLoading }}
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError">取得資料失敗</p>
        <ul v-else>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

新增資料的元件我們稱為 `CreateTodo.vue`，這邊我們會使用 `useMutation` 來處理新增資料的請求。

我們在 `useMutation` 中，需要傳入一個 `mutationFn` 函式，這個函式會接收一個參數，這個參數就是我們要新增的資料。

之後將 `mutate` 從 `useMutation` 中拿出來，並且綁定到 `button` 的 `@click` 事件中，當按下按鈕時，就會發送請求。

在請求發出去的時候，會進入到 `isPending` 狀態，請求成功後，會進入到 `isSuccess` 狀態，請求失敗後，會進入到 `isError` 狀態。

<!-- prettier-ignore -->
```html title="CreateTodo.vue" showLineNumbers
<script setup>
import { useMutation } from "@tanstack/vue-query";
import axios from "axios";

// 定義一個 API 請求函式
const createTodo = async (newTodo) => {
    const { data } = await axios.post("http://localhost:3002/todos", newTodo);
    return data;
};

// 使用 useMutation 來管理這個請求
const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: createTodo
});

const handleCreateTodo = () => {
    mutate({ id: crypto.randomUUID(), title: "新待辦事項" });
};
</script>

<template>
    <div>
        <button @click="handleCreateTodo" :disabled="isPending">
            {{ isPending ? "新增中..." : "新增 Todo" }}
        </button>
        <p v-if="isSuccess">成功新增！</p>
        <p v-if="isError">發生錯誤，請稍後再試</p>
    </div>
</template>
```

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import Todos from "./components/Todos.vue";
import AddTodo from "./components/CreateTodo.vue";
</script>

<template>
    <AddTodo />
    <Todos />
    <VueQueryDevtools />
</template>
```

### 跨元件重新請求

在 `CreateTodo.vue` 中，觸發了 `mutate` 後，會將資料新增到 `json-server` 中，這時候我們在 `Todos.vue` 中，會發現資料並沒有即時更新。

但我們渲染資料的地方是在 `Todos.vue` 中，而新增資料的地方是在 `CreateTodo.vue`，所以如果要跨元件重新請求資料，可以引入 `useQueryClient` 並在 `CreateTodo.vue` 中，`mutate` 成功後，使用 `queryClient.invalidateQueries` 來重新請求資料。

在 `invalidateQueries` 中，我們需要傳入 `queryKey`，這個 `queryKey` 就是我們在 `useQuery` 中設定的 `queryKey`，這樣就可以讓 `Todos.vue` 中的資料即時更新。

<!-- prettier-ignore -->
```html title="CreateTodo.vue" showLineNumbers
<script setup>
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import axios from "axios";

const queryClient = useQueryClient();

// 定義一個 API 請求函式
const createTodo = async (newTodo) => {
    const { data } = await axios.post("http://localhost:3002/todos", newTodo);
    return data;
};

// 使用 useMutation 來管理這個請求
const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
        // 當請求成功時，強制更新快取，讓資料保持同步
        queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
});

const handleCreateTodo = () => {
    mutate({ id: crypto.randomUUID(), title: "新待辦事項" });
};
</script>

<template>
    <div>
        <button @click="handleCreateTodo" :disabled="isPending">
            {{ isPending ? "新增中..." : "新增 Todo" }}
        </button>
        <p v-if="isSuccess">成功新增！</p>
        <p v-if="isError">發生錯誤，請稍後再試</p>
    </div>
</template>
```

### 同元件重新請求

順便補充一下，如果我們在同一個元件中，想要重新請求資料，可以透過 `useQuery` 的 `refetch` 來重新請求資料。

<!-- prettier-ignore -->
```html title="Todos.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:3002/todos");
    return data;
};

const {
    data: todos,
    isLoading,
    isError,
    refetch,
} = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos
});

const handleRefetch = () => {
    refetch();
};
</script>

<template>
    <div>
        <button @click="handleRefetch">重新請求</button>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError">取得資料失敗</p>
        <ul v-else>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

## mutate 和 mutateAsync 的差別

`mutate` 和 `mutateAsync` 的差別在於，`mutate` 是同步的，而 `mutateAsync` 是非同步的。

`mutateAsync` 會回傳一個 Promise，所以可以透過 `await` 來等待請求完成。

| 特性                         | mutate                                 | mutateAsync                               |
| ---------------------------- | -------------------------------------- | ----------------------------------------- |
| 是否回傳 Promise             | 不回傳 Promise                         | 回傳 Promise                              |
| 是否支援 await               | 不支援                                 | 可搭配 await                              |
| 錯誤處理                     | 透過 onError callback 處理             | 可以用 try/catch 捕捉錯誤                 |
| 是否能獲取 mutation 的回應值 | 需透過 onSuccess callback 取得         | 可直接 const result = await mutateAsync() |
| 適合場景                     | 簡單的事件處理，例如按鈕點擊後發送請求 | 需要等待 API 完成後執行後續邏輯           |

<!-- prettier-ignore -->
```html title="CreateTodo.vue" showLineNumbers
<script setup>
import { useMutation } from '@tanstack/vue-query'
import axios from 'axios'

const createTodo = async (newTodo) => {
    const { data } = await axios.post("http://localhost:3002/todos", newTodo);
    return data;
};

const { mutate, mutateAsync, isPending } = useMutation({
  mutationFn: createTodo
})

// 使用 mutate (callback 方式)
const handleAddTodoWithMutate = () => {
  mutate({ title: '使用 mutate' }, {
    onSuccess: (data) => {
      console.log('mutate 成功:', data)
    },
    onError: (error) => {
      console.error('mutate 失敗:', error)
    }
  })
}

// 使用 mutateAsync (await 方式)
const handleAddTodoWithMutateAsync = async () => {
  try {
    const newTodo = await mutateAsync({ title: '使用 mutateAsync' })
    console.log('mutateAsync 成功:', newTodo)
  } catch (error) {
    console.error('mutateAsync 失敗:', error)
  }
}
</script>

<template>
  <div>
    <button @click="handleAddTodoWithMutate" :disabled="isPending">
      使用 mutate
    </button>
    <button @click="handleAddTodoWithMutateAsync" :disabled="isPending">
      使用 mutateAsync
    </button>
  </div>
</template>
```

## 參考資料

-   [Vue Query 官方文件](https://tanstack.com/query/latest/docs/framework/vue/reference/useMutation)
