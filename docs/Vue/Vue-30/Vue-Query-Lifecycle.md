---
title: "[vue] Vue Query 介紹： Vue Query 資料生命週期介紹"

keywords: [Vue3, tanstack, useQuery]

description: "Vue Query 資料生命週期介紹(stale,fresh,paused,inActive)"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹： Vue Query 資料生命週期介紹"

og:description: "Vue Query 資料生命週期介紹(stale,fresh,paused,inActive)"

sidebar_position: 23
---

# Vue Query 資料生命週期介紹

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## 簡介

在 Vue Query 中，資料會依照以下 **五種狀態** 來變化：

| 狀態         | 說明                                                                   |
| ------------ | ---------------------------------------------------------------------- |
| **Fresh**    | 資料是新鮮的，不需要重新請求，除非手動 `refetch`。                     |
| **Fetching** | 正在發送 API 請求並取得資料。                                          |
| **Stale**    | 資料變成「不新鮮」，但仍可使用快取。                                   |
| **Paused**   | 因為網路問題，請求暫停。                                               |
| **Inactive** | 此資料目前沒有被任何元件使用，會進入回收機制 (gc,garbage collection)。 |

我們著重介紹 `Fresh`、`Stale`、`Inactive` 這三個狀態，想進一步了解其他狀態的可以看[影片](https://www.youtube.com/watch?v=pxHSArLEvgs)。

## 安裝 vue-query-devtools

為了方便我們觀察資料的狀態，我們會安裝 [vue-query-devtools](https://tanstack.com/query/latest/docs/framework/vue/devtools) 這個套件，可以透過它提供的 panel 來觀察資料的狀態。

```bash
npm install @tanstack/vue-query-devtools
```

安裝完之後，我們需要在 `App.vue` 中引入 `VueQueryDevtools` 並在 `template` 中渲染。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>

<template>
    <VueQueryDevtools />
</template>
```

要是成功的話會看到畫面的右下角出現一個小圖示，點擊它就可以看到 Vue Query 的 panel。

![Image](https://i.imgur.com/zVtR7dz.png)

![Image](https://i.imgur.com/c3SNwQu.png)

## 設定資料生命週期

當你使用 `useQuery` 取得 API 資料時，預設 **所有資料都會是 Stale**，而在 Vue Query 中，不新鮮的資料(Stale) 會在以下情況下被重新請求：

-   當 **元件重新載入(Unmount -> Mount)**，Vue Query 就會去重新請求資料。
-   當 **頁面重新聚焦(切到其他頁面再切回來 refetchOnWindowFocus)**，Vue Query 就會去重新請求資料。

### 設定 staleTime

而我們可以設定 `staleTime` 來決定資料多久會從 `Fresh` 變成 `Stale`，預設是 0 秒，也就是資料一取得就會變成 `Stale`，這邊我們設定 3 秒。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");
    return data;
};

const {
    data: todos,
    isLoading,
    isError,
} = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 3000,
});
</script>

<template>
    <div>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError">取得資料失敗</p>
        <ul v-else>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>

    <VueQueryDevtools />
</template>
```

![Image](https://i.imgur.com/msp6t8K.png)

過了 3 秒後，資料就會從 `Stale` 變成 `Fresh`。

![Image](https://i.imgur.com/fM7lh0L.png)

所以這樣設定後，資料的狀態會是 `Fetching` -> `Fresh`(3 秒) -> `Stale`

### 設定 refetchOnWindowFocus

我們可以設定 `refetchOnWindowFocus` 來決定當頁面重新聚焦時，是否要重新請求資料，預設是開啟的。

<!-- prettier-ignore -->
```js
const {
    data: todos,
    isLoading,
    isError,
} = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: 3000,
    refetchOnWindowFocus: false // 調成 false 後，切分頁後，再次切回來就不會發 request 了。
});
```

### 永不過期

如果想要資料永遠都保持 `Fresh` 狀態，可以將 `staleTime` 設定為 `Infinity`。

<!-- prettier-ignore -->
```js
const {
    data: todos,
    isLoading,
    isError,
} = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    staleTime: Infinity,
});
```

這樣設定後，資料的狀態會是 `Fetching` -> `Fresh`(永久不過期)，所以就不會觸發重新請求資料，除非我們手動去 `refetch`。

會將資料設定為永久不過期，是因為我們知道資料不會變動，所以不需要重新請求資料，這樣可以避免不必要的請求，提升效能。

### 設定 gcTime (garbage collection)

我們可以設定 `gcTime` 來決定資料多久會進入回收機制，預設是 5 分鐘，這邊我們設定 5 秒，然後將 `component unmount` 後，會先看到資料變成 `Inactive`，然後 5 秒後資料就會被回收，也就不會在 panel 中看到資料。

為了讓大家看到效果，我們需要額外建立一個 `Todos.vue` 元件，並在 `App.vue` 中引入它，所以程式碼改成這樣。

<!-- prettier-ignore -->
```html title="Todos.vue" showLineNumbers
<script setup>
import { useQuery } from "@tanstack/vue-query";
import axios from "axios";

const fetchTodos = async () => {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5");
    return data;
};

const {
    data: todos,
    isLoading,
    isError,
} = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    gcTime: 5000,
});
</script>

<template>
    <div>
        <p v-if="isLoading">載入中...</p>
        <p v-else-if="isError">取得資料失敗</p>
        <ul v-else>
            <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
        </ul>
    </div>
</template>
```

然後在 `App.vue` 的 `template` 中加入一個按鈕，點擊按鈕後，會切換 `Todos.vue` 元件是否顯示。

<!-- prettier-ignore -->
```html title="App.vue" showLineNumbers
<script setup>
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";
import { ref } from "vue";
import Todos from "./components/Todos.vue";
const toggle = ref(false);

const handleToggle = () => {
    toggle.value = !toggle.value;
};
</script>

<template>
    <button @click="handleToggle">Toggle</button>
    <Todos v-if="toggle" />
    <VueQueryDevtools />
</template>
```

當元件 `unmount` 的時候，就會看到資料變成 `Inactive`，然後 5 秒後資料就會被回收，也就不會在 panel 中看到資料。

![Image](https://i.imgur.com/91tpeVf.png)

## 參考資料

-   [Vue Query 官方文件](https://tanstack.com/query/v4/docs/framework/vue/guides/important-defaults)
