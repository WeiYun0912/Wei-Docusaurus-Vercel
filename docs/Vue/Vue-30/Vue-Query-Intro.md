---
title: "[vue] Vue Query 介紹： 讓 API 資料管理更簡單方便"

keywords: [Vue3, tanstack, useQuery]

description: "Vue Query 是一個 伺服器狀態管理 (Server State Management) 工具"

author: WeiYun0912

og:title: "[vue] Vue Query 介紹： 讓 API 資料管理更簡單方便"

og:description: "Vue Query 是一個 伺服器狀態管理 (Server State Management) 工具"

sidebar_position: 19
---

import Giscus from "@site/src/components/GiscusComponent"

# Vue Query 介紹： 讓 API 資料管理更簡單方便

不喜歡看字的可以看影片：

-   [Vue3 教學 - Vue Query Part.1 使用 useQuery 與 useMutation](https://www.youtube.com/watch?v=7MDI54nlEbc)
-   [Vue3 教學 - Vue Query Part.2 資料生命週期與重新獲取機制 (stale,fresh,paused,inActive)](https://www.youtube.com/watch?v=pxHSArLEvgs)
-   [Vue3 教學 - Vue Query Part.3 使用 placeholderData 與 keepPreviousData 提升分頁體驗](https://www.youtube.com/watch?v=skJWxXDljS0)
-   [Vue3 教學 - Vue Query Part.4 使用 useMutation 進行樂觀更新](https://www.youtube.com/watch?v=I-qGvLln-pg)
-   [Vue3 教學 - Vue Query Part.5 如何使用 enabled 控制查詢與 prefetch 提升使用者體驗](https://www.youtube.com/watch?v=8TpZAL-E6gs)

## 簡介

在 Vue 應用中，我們經常需要從 API 取得資料並在畫面上顯示。傳統的方式通常是這樣的：

1. 使用 `axios` 或 `fetch` 來發送 API 請求。
2. 設定 `loading` 狀態，確保 UI 有請求進行中的狀態。
3. 處理請求成功與失敗的邏輯。
4. 儲存資料到 `ref()` 或 `reactive()`，以便畫面更新。
5. 處理重複請求、快取、重新整理等問題。

這樣的做法在小型專案還算可行，但當應用變得複雜，請求變多時，我們就會遇到許多挑戰，例如：

-   請求狀態管理變複雜：要追蹤 `loading`、`error`、`success` 等狀態，每個 API 當前請求的狀態都不同。
-   資料同步問題：當 API 回應後，如何確保所有元件顯示的是最新的資料?
-   手動處理快取：如果不同元件需要相同的 API 資料，該如何避免重複請求?
-   效能與最佳化：如何減少不必要的 API 呼叫?

這時候，Vue Query 就能派上用場了~

## 什麼是 Vue Query?

Vue Query 是一個 伺服器狀態管理 (Server State Management) 工具，它能幫助我們 自動管理 API 資料，並解決上述的問題。它的主要功能包括：

-   自動管理請求狀態（如 `loading`、`error`、`success`）。
-   提供快取機制，避免重複請求。(可設定快取時間、快取策略)
-   自動重新同步資料，確保畫面上的內容始終是最新的。
-   內建的錯誤處理與重試機制。

## Vue Query 的機制

Vue Query 主要透過 `Query Key` 來管理 API 資料，當我們發送 API 請求時，它會記錄這個請求的結果，並根據這個 `Query Key` 來決定是否應該重新取得資料、快取、或使用背景更新。

1. 快取 (Caching)：當相同的 `Query Key` 被多個元件使用時，可以設定 `staleTime` 來決定快取時間，以此避免發送重複的請求，而是直接從快取取得資料。
2. 背景同步 (Background Refetching)：當使用者重新聚焦到頁面或重新載入時，Vue Query 會自動更新資料，可設定 `refetchOnWindowFocus` 來決定是否要自動更新資料。
3. 錯誤處理與重試 (Retries & Error Handling)：當請求失敗時，它會自動重試，減少 API 失敗帶來的影響，可設定 `retry` 來決定重試次數。

## 簡單範例

以下是一個使用 Vue Query 的簡單例子，它會從 API 取得 todos 資料並顯示在畫面上，下一篇再來介紹安裝和使用。

<!-- prettier-ignore -->
```html title='App.vue' showLineNumbers
<script setup>
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios'

const fetchTodos = async () => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos')
  return data
}

const { data: todos, isLoading, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos
})
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

說明：

-   `useQuery` 會發送 API 請求並管理狀態。
-   `queryKey` 是這個查詢的識別符，Vue Query 會根據它來決定是否快取或重新請求。
-   `isLoading`、`isError` 讓我們輕鬆管理 UI 狀態。
-   `data` 會自動更新，不需要手動 ref() 來存資料。

## 參考資料

-   [Vue Query 官方文件](https://tanstack.com/query/latest/docs/framework/vue/overview)

<Giscus />
