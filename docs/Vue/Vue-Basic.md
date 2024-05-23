---
title: "[vue] Vue 基礎語法"

keywords: [vue3, vue]

description: Vue 基礎語法

author: WeiYun0912

og:title: Vue 基礎語法

og:description: Vue 基礎語法
---

## 說明

記錄一下 Vue 常用的基礎語法

## v-bind

`v-bind` 是用來將數據綁定到 HTML 元素上的功能，v-bind 是屬於單向數據綁定。

以下面程式碼為例，如果想要綁定動態的數據，這樣寫是無效的，Vue 會直接把這段 a 連結的 href 當成字串。

```jsx title='App.vue' showLineNumbers
<template>
  <a href="href">Youtube</a>
</template>

<script setup>
const href = 'https://www.youtube.com/'
</script>
```

我們必須在 href attr 前面加上 v-bind，但因為 v-bind 太常使用了，所以 Vue 也使用了 `:` 語法糖來代替 v-bind，但功能是一樣的。

```jsx title='App.vue' showLineNumbers
<template>
  <a v-bind:href="href">Youtube</a>
</template>

<script setup>
const href = 'https://www.youtube.com/'
</script>
```

所以這樣寫也是可以的，也建議要使用 v-bind 的話，這樣寫就好，現在這個 a 連結就會連結到 `https://www.youtube.com/`。

```jsx title='App.vue' showLineNumbers
<template>
  <a :href="href">Youtube</a>
</template>

<script setup>
const href = 'https://www.youtube.com/'
</script>
```

## v-model

`v-model` 也就是大家常聽到的`雙向數據綁定`，常用在處理 input 的輸入值。

我們在 input 上使用 `v-model`，並把值設定為 `text`，在 `script` 的區塊，宣告一個`同名`的變數 `text`，然後使用 `ref` 來告訴 Vue，我們的 `text` 是響應式參考，這樣當 `text` 改變的時候，Vue 就會幫我們重新渲染畫面。

現在只要在 input 裡面輸入文字的話，我們的 text 也會跟著改變，這就是所謂的雙向綁定。

```jsx title='App.vue' showLineNumbers
<template>
  <input v-model="text" />
  {{ text }}
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
</script>
```

### v-model.number

如果想要讓 input 裡面的值，自動轉換為 `Number` 型別的話，可以使用 `v-model.number`。

以下的例子會在畫面上顯示 `number`

```jsx title='App.vue' showLineNumbers
<template>
  <input v-model.number="text" type="text" />
  {{ typeof text }}
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
</script>
```

以下的例子會在畫面上顯示 `string`

```jsx title='App.vue' showLineNumbers
<template>
  <input v-model="text" type="text" />
  {{ typeof text }}
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
</script>
```

### v-model.trim

如果想要讓 input 內的值自動消除`前後空格`的話，可以使用 `v-model.trim`，相當於我們在 js 使用字串的 `trim()` 方法。

```jsx title='App.vue' showLineNumbers
<template>
  <input v-model.trim="text" type="text" />
  {{ text }}
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
</script>
```

![Image](https://i.imgur.com/dTxi0xW.png)

### v-model.lazy

`v-model.lazy` 用於延遲更新 v-model 綁定的數據，直到元素失去焦點，等同於我們在 input 上監聽 @change 事件。

```jsx title='App.vue' showLineNumbers
<template>
  <input v-model.lazy="text" type="text" />
  {{ text }}
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
</script>
```

### 在自訂元件中使用 v-model

如果要在我們自訂的元件使用 v-model，就必須做額外的設定。

先在元件中綁定 v-model

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseInput v-model="searchText" />
  {{ searchText }}
</template>

<script setup>
import { ref } from 'vue'
import AppCourseInput from './AppCourseInput.vue'
const searchText = ref('')
</script>
```

而在元件內部，必須使用 `defineProps` 和 `defineEmits` 來定義，這邊要注意的是 `modelValue` 和 `update:modelValue` 這兩個名稱是固定的，沒有辦法更改，所以只要名字打錯，就會沒有效果。

```jsx title='AppCourseInput.vue' showLineNumbers
<template>
  <input
    type="text"
    :value="modelValuea"
    placeholder="Enter text...."
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: () => ''
  }
})
defineEmits(['update:modelValue'])
</script>

```

### 在自訂元件中使用多個 v-model

如果要在自訂元件中使用多個 v-model，則需要更改一下寫法。

這邊新增了一個 category 的響應式數據，然後將原本的寫法更改為 `v-model:searchText="searchText"`，並同時新增 `v-model:category="category"`

```jsx title='AppCourse.vue' showLineNumbers
<template>
  <AppCourseInput v-model:searchText="searchText" v-model:category="category" />
  {{ searchText }}
  {{ category }}
</template>

<script setup>
import { ref } from 'vue'
import AppCourseInput from './AppCourseInput.vue'
const searchText = ref('')
const category = ref('default')
</script>
```

```jsx title='AppCourseInput.vue' showLineNumbers
<template>
  <input
    type="text"
    :value="searchText"
    placeholder="Enter text...."
    @input="$emit('update:searchText', $event.target.value)"
  />

  <select :value="category" @change="$emit('update:category', $event.target.value)">
    <option value="toy">玩具</option>
    <option value="clothe">衣物</option>
    <option value="food">食品</option>
  </select>
</template>

<script setup>
defineProps({
  searchText: {
    type: String,
    default: () => ''
  },

  category: {
    type: String,
    default: () => 'default'
  }
})
defineEmits(['update:searchText', 'update:category'])
</script>
```

## v-on

`v-on` 是 Vue 提供監聽 DOM 事件的語法，但在撰寫的時候並不會寫 v-on 而是用 `@` 符號取代之，例如我們如果需要 onClick 事件的話，就會寫 `@click`。

```jsx title='App.vue' showLineNumbers
<template>
  <button @click="handleClick">Click</button>
</template>

<script setup>
const handleClick = () => {
  console.log("click");
};
</script>
```

## v-once

`v-once` 是用來渲染靜態資料用的，使用 `v-once` 的元素，只會渲染一次，以下程式碼因為 p 元素被加上了 `v-once`，即使修改了 `text` 響應式數據也不會重新渲染。

```jsx title='App.vue' showLineNumbers
<template>
  <input v-model="text" type="text" />
  <p v-once>{{ text }}</p>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('123')
</script>
```

## v-for

`v-for` 是用來渲染物件或陣列用的

渲染陣列

```jsx title='App.vue' showLineNumbers
<template>
  <p v-for="animal in animals" :key="animal.name">
    {{ animal.name }}
  </p>
</template>

<script setup>

const animals = [
  {
    name: 'tiger'
  },
  {
    name: 'zebra'
  },
  {
    name: 'wolf'
  }
]
</script>
```

渲染物件

```jsx title='App.vue' showLineNumbers
<template>
  <li v-for="(value, key, index) in person" :key="index">
    {{ index }}: {{ key }} - {{ value }}
  </li>
</template>

<script setup>
const person = {
  firstName: 'John',
  lastName: 'Doe'
}
</script>
```

渲染特定資料筆數

```jsx title='App.vue' showLineNumbers
<template>
  <li v-for="n in 5" :key="n">
    {{ n }}
  </li>
</template>
```

## v-if

`v-if` 是用來判斷元素是否要渲染在畫面上的語法，允許根據某個條件決定是否渲染一個元素或元素區塊，也可以搭配 `v-else-if` 或 `v-else`。

以下程式碼會在畫面上顯示 `正數`

```jsx title='App.vue' showLineNumbers
<template>
  <p v-if="number > 0">正數</p>
  <p v-if="number < 0">負數</p>
</template>

<script setup>
const number = 1
</script>
```

## template

有時候我們會希望使用 `v-if` 判斷元素是否要渲染的時候，不要再額外增加一個元素。

```jsx title='App.vue' showLineNumbers
<template>
  <div v-if="number > 0">
    <p>正數</p>
  </div>
</template>

<script setup>
const number = 1
</script>
```

上面的寫法，在畫面上會多渲染一個 div 元素。

![Image](https://i.imgur.com/cJoJvLP.png)

如果不希望渲染多餘的元素，可以改用 `template`。

```jsx title='App.vue' showLineNumbers
<template>
  <template v-if="number > 0">
    <p>正數</p>
  </template>
</template>

<script setup>
const number = 1
</script>
```

![Image](https://i.imgur.com/wZkHfYO.png)

## watch

如果要去監聽`響應式數據`的變化時，可以使用 `watch`。

我們使用 `watch` 監聽了 `count`，當 `count` 的值有變化的時候，就會觸發 `watch` 裡面的 function，該 function 可以接收到新的值與舊的值。

```jsx title='App.vue' showLineNumbers
<template>
  {{ count }}
  <button @click="count += 1">c</button>
</template>

<script setup>
import { ref, watch } from 'vue'

const count = ref(1)

watch(count, (newValue, oldValue) => {
  console.log('new', newValue)
  console.log('old', oldValue)
})
</script>
```

## 參考資料

[Vue 3.x 全家桶完全指南与实战（TypeScript + Vue Router 4 + Vuex 4...）](https://www.udemy.com/course/vue3-vue-router4-vuex4-complete-tutorial/)
