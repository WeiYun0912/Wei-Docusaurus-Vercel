---
title: "[vue] Vue Router"

keywords: [vue3, vue]

description: Vue Router

author: WeiYun0912

og:title: Vue Router

og:description: Vue Router
---

## 說明

記錄一下 `vue-router` 的一些使用方法，不是教學文章~

## RouterLink

`RouterLink` component 的 `to` 能讓我們跳轉到其他路由

```jsx title='AppNavbar.vue' showLineNumbers
<template>
  <div>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </div>
</template>

<script setup></script>
```

## RouterView 渲染頁面子元件

新增兩個 child component 到 `AboutView` 底下

```js title='router.js' showLineNumbers
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/about",
      name: "about",
      component: AboutView,
      children: [
        {
          path: "intro",
          component: Introduction,
        },
        {
          path: "tech",
          component: TechStack,
        },
      ],
    },
  ],
});
```

要渲染出 child component，可以使用 `RouterView`。

```jsx title='AboutView.jsx' showLineNumbers
<template>
  <h1>AboutView</h1>
  <RouterLink to="/about/intro">Self-Introduction</RouterLink>
  <RouterLink to="/about/tech">My Tech Stack</RouterLink>

  <RouterView />
</template>

<script setup></script>
```

## 動態路由

```js title='router.js' showLineNumbers
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":productId",
          component: Product,
        },
      ],
    },
  ],
});
```

這邊因為要動態的給 `id`，所以使用 `:to`。

```jsx title='ProductsView.jsx' showLineNumbers
<template>
  <ul>
    <li v-for="n in 3" :key="n">
      {/* 1 2 3 */}
      <RouterLink :to="`${n}`">Product {{ n }}</RouterLink>
    </li>
  </ul>
  <RouterView />
</template>
<script setup></script>
```

要在 `ProductView` 取得路由傳遞進來的 `id`，可以使用 `useRoute`。

但在我們的 `productId` 改變後，頁面上顯示的還是我們第一次進入的頁面 id。

例如：第一次進入 `/products/1`，頁面顯示 `product id : 1`，第二次進入 `/products/2`，頁面還是顯示 `product id : 1`。

```jsx title='ProductView.vue' showLineNumbers
<template>
  <h1>product id : {{ productId }}</h1>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const { productId } = route.params
</script>
```

所以我們可使用 `watch` 來監聽 route 是否有變化，並設定 `immediate : true`，這樣在 component mount 的時候會立刻執行一次 watch 內的程式碼。

```jsx title='ProductView.jsx' showLineNumbers
<template>
  <h1>product id : {{ productId }}</h1>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = ref(null)

// 監聽 route 物件的變化
watch(
  route,
  () => {
    productId.value = route.params.productId
  },
  { immediate: true }
)
</script>
```

## 動態路由匹配語法

動態路由也支援`匹配語法`及`正規表達式`，匹配語法有三種，分別是 `+`、`*`、`?`。

### 符號 +

在動態路由上加上 `+` 符號，代表至少要出現 1 次。

- 匹配 /1
- 匹配 /2
- 匹配 /1/2
- 不匹配 /

如果使用 `+` 後，訪問 `/1`，這時候在裡面接收到參數會變成陣列 `["1"]`，如果訪問 `/1/2`，會變成 `["1","2"]`。

```js title='router.js' showLineNumbers {10}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":productId+",
          component: Product,
        },
      ],
    },
  ],
});
```

### 符號 \*

在動態路由上加上 `*` 符號，代表可以出現 0 到多次。

- 匹配 /
- 匹配 /1
- 匹配 /2
- 匹配 /1/2

如果使用 `*` 後，訪問 `/1`，這時候在裡面接收到參數會變成陣列 `["1"]`，如果訪問 `/1/2`，會變成 `["1","2"]`

```js title='router.js' showLineNumbers {10}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":productId*",
          component: Product,
        },
      ],
    },
  ],
});
```

### 符號 ?

在動態路由上加上 `?` 符號，代表出現 0 到 1 次。

- 匹配 /1
- 匹配 /2
- 不匹配 /1/2
- 不匹配 /

```js title='router.js' showLineNumbers {10}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":productId?",
          component: Product,
        },
      ],
    },
  ],
});
```

### Regex

動態路由也支援正規表達式的寫法，這樣的寫法表示 `productId` 只能是數字。

- 匹配 /1
- 匹配 /12
- 不匹配 /abc

```js title='router.js' showLineNumbers {10}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":productId([0-9]+)",
          component: Product,
        },
      ],
    },
  ],
});
```

### Not Found

我們也可以新增不匹配後的路由

```js title='router.js' showLineNumbers {10}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":productId([0-9]+)",
          component: Product,
        },
      ],
    },
    {
      path: "/:notfound(.*)*",
      component: NotFound,
    },
  ],
});
```

## query

如果要取得 url 的 query string，也可以直接使用 `useRoute`，裡面回傳的 route 物件就有包含 `query`。

如果網址是 `http://localhost:5173/products/1?searchText=123`， `route.query` 內的物件就會是：

```json
{
  "searchText": "123"
}
```

```jsx title='ProductView.jsx' showLineNumbers
<template>
  <h1>product id : {{ productId }}</h1>
  <pre>{{ query }}</pre>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = ref(null)
const query = ref({})
// 監聽 route 物件的變化
watch(
  route,
  () => {
    productId.value = route.params.productId
    query.value = route.query
  },
  { immediate: true }
)
</script>
```

## 使用命名路由切換頁面 (推薦)

可以在 `RouterLink` 的 `to` 使用傳入物件的方式切換頁面，也比較推薦這樣做，這樣就不會遇到一些相對路徑或優先順序的問題，也比較有靈活性。

先給路由的名稱(name)，等下要使用這個名稱來決定要切換到哪個頁面。

```js title='router.js' showLineNumbers {6,11}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":productId",
          name : "product"
          component: Product,
        },
      ],
    },
  ],
});
```

這邊的 `to` 要改成 `:to`，因為我們要用動態的方式傳入值，接著就傳入 `name` 屬性，值就是我們剛剛在 `router.js` 設定的 `name`。

```jsx title='AppNavbar.vue' showLineNumbers
<template>
  <RouterLink :to="{ name: 'products' }">Products</RouterLink>
</template>
```

如果有 `params` 或 `query string` 要傳遞的話也很簡單

```jsx title='AppNavbar.vue' showLineNumbers
<template>
  <ul>
    <li v-for="n in 3" :key="n">
      <RouterLink :to="{ name: 'product', params: { id: n }, query: { searchText: 'Hello World' } }">
        Product {{ n }}
      </RouterLink>
    </li>
  </ul>
  <RouterView />
</template>
```

如果用傳入物件的方式來跳轉頁面，也能有效避免 `path` 名稱一樣的問題。

```js title='router.js' showLineNumbers {6,11}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ":id",
      name: "product",
      component: Product,
    },
    {
      path: ":id",
      name: "blog",
      component: BlogPost,
    },
  ],
});
```

## alias

如果希望讓不同路徑渲染同一個 component，可以使用 `alias`。

這樣設定表示如果匹配到 `/home` 和 `/index`，都會渲染 `HomeView`。

```js title='router.js' showLineNumbers {8}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      alias: ["/home", "/index"],
    },
  ],
});
```

## redirect

如果希望匹配到某路徑就要自動導向到其他路徑的話，可以使用 `redirect`。

這樣設定表示如果匹配到 `/home` 和 `/index`，都會被導向 `/`。

```js title='router.js' showLineNumbers {12}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/",
      alias: ["/home", "/index"],
      redirect: "/",
    },
  ],
});
```

或是可以再次使用 `name` 的方式來跳轉

這樣設定表示如果匹配到 `/home` 和 `/index`，都會被導向 `/products`，也就是渲染 `Products`。

```js title='router.js' showLineNumbers {12-14}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/",
      alias: ["/home", "/index"],
      redirect: {
        name: "products",
      },
    },
    {
      path: "/products",
      name: "products",
      component: Products,
    },
  ],
});
```

但是如果有動態參數需要傳遞的話，就不能使用上面的寫法。

這樣設定表示如果匹配到 `/product/1`，會直接被當作字串傳遞到 url，導致我們被導向到 `/:id`。

```js title='router.js' showLineNumbers {16-19}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":id",
          name: "product",
          component: Product,
        },
      ],
    },
    {
      path: "/product/:id",
      redirect: "/:id",
    },
  ],
});
```

我們可以透過 redirect 提供給我們的 function 來解決上述問題，該 function 會自動帶入一個參數，通常稱為 `to`。這個 `to` 參數是一個物件，其中包含了當前路由的相關資訊。

`to` 物件裡面可以使用 `params` 來取得動態參數

```js title='router.js' showLineNumbers {16-23}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":id",
          name: "product",
          component: Product,
        },
      ],
    },
    {
      path: "/product/:id",
      redirect: (to) => {
        return {
          path: `products/${to.params.id}`,
        };
      },
    },
  ],
});
```

我們一樣可以使用傳入 `name` 的方式

```js title='router.js' showLineNumbers {16-26}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":id",
          name: "product",
          component: Product,
        },
      ],
    },
    {
      path: "/product/:id",
      redirect: (to) => {
        return {
          name: "product",
          params: {
            id: to.params.postId,
          },
        };
      },
    },
  ],
});
```

## push

```js title='router.js' showLineNumbers {14-18}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/products",
      name: "products",
      component: Products,
      children: [
        {
          path: ":id",
          name: "product",
          component: Product,
        },
      ],
    },
  ],
});
```

如果不希望透過 `RouterLink` 來跳轉頁面，可以使用 `useRouter` 提供的 `push` 方法，`push` 方法會在我們瀏覽器的 `history` 新增一筆跳轉後的記錄，這表示著當使用者點擊「上一頁」按鈕時，他們能夠返回到跳轉之前的頁面。

```jsx title='ProductsView.vue' showLineNumbers
<template>
  <ul>
    <li v-for="n in 3" :key="n">
      <button @click="handleClick(n)">Product {{ n }}</button>
    </li>
  </ul>
  <RouterView />
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = (id) => {
  router.push({
    name: 'product',
    params: { id: id }
  })
}
</script>
```

## replace

如果不希望保留跳轉後的記錄，可以改用 `replace`。

```jsx title='ProductsView.vue' showLineNumbers
<template>
  <ul>
    <li v-for="n in 3" :key="n">
      <button @click="handleClick(n)">Product {{ n }}</button>
    </li>
  </ul>
  <RouterView />
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = (id) => {
  router.replace({
    name: 'product',
    params: { id: id }
  })
}
</script>
```

## RouterView name

`RouterView` 也支援傳入 `name` 屬性，根據 `name` 的值來決定要渲染出哪個 component，如果不傳入 `name` 的話，就會自動渲染 `default`。

```js title='router.js' showLineNumbers {16-26}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        header: Header,
        default: HomeView,
        footer: Footer,
      },
    },
  ],
});
```

```jsx title='App.vue' showLineNumbers
<template>
  <RouterView name="header" />
  <RouterView />
  <RouterView name="footer" />
</template>
```

## 全域導航生命週期

### beforeEach

`beforeEach` 會在路由改變之前觸發，較常用於權限驗證。

```js title='router.js' showLineNumbers
const login = false;

router.beforeEach((to, from) => {
  if (to.path.startsWith("/blog")) {
    if (!login) {
      return "/";
    }
  }
});
```

### beforeResolve

`beforeResolve` 會在 `beforeEach` 後執行，較常用於使用者登入後的一些操作，像是讀取資料。

```js title='router.js' showLineNumbers
const login = true;

router.beforeEach((to, from) => {
  if (to.path.startsWith("/blog")) {
    console.log("hi");
    if (!login) {
      return "/";
    }
  }
});

router.beforeResolve((to, from) => {
  if (to.path.startsWith("/blog")) {
    console.log("使用者登入成功");
  }
});
```

### afterEach

`afterEach` 會在頁面跳轉後執行

```js title='router.js' showLineNumbers
router.beforeResolve((to, from) => {
  document.title = to.path;
});
```

## 路由導航

# 持續記錄中...
