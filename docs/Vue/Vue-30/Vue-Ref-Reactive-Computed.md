---
title: "[vue] Vue Ref、Reactive、Computed"

keywords: [vue3, ref, reactive]

description: Vue Ref、Reactive、Computed 。

author: WeiYun0912

og:title: "[vue, ref, reactive, computed] Vue Ref、Reactive、Computed"

og:description: "Vue Ref、Reactive、Computed"
---

# Vue Ref、Reactive、Computed

## ref & reactive

:::tip

1. 如果需要一個基本數據類型的響應式數據，使用 `ref`。
2. 如果需要一個物件類型的響應式數據，使用 `reactive`。
3. 如果需要一個物件類型的響應式數據，並且結構較深層，使用 `reactive` (表單結構等)。
   (但我還是都 ref 到底)

:::

在下方我們使用 reactive 來創建一個物件 `car`，並透過 `changeCarName` 和 `changeCar` 來改變 `car` 的屬性。

但 `changeCar` 的時候，`car` 的屬性會被重新賦值，這時候 `car` 的屬性就會變成新的物件，而不是原來的物件，也就表示 `car` 的屬性不再是響應式的。

當你使用 reactive 定義一個物件時，Vue 會將該物件的屬性進行代理（proxy）。

只有修改這個`物件內部的屬性時`，Vue 才能捕捉變更並觸發相應的更新。
如果你直接將 car 變數重新指向另一個物件，這並不會影響原來的代理，也就無法觸發 Vue 的響應更新機制。

所以當你有非常多屬性要改變時，需要使用 `Object.assign` 來改變 `car` 的屬性。

```js
<script setup>
import { ref, reactive } from "vue";

let car = reactive({
    name: "BMW",
    price: 100000,
});

function changeCarName(newName) {
    car.name = newName;
}

function changeCar() {
    car = {
        name: "Audi",
        price: 200000,
    };
}

function correctChangeCar() {
    car.name = "Audi";
    car.price = 200000;

    // OR

    Object.assign(car, {
        name: "Audi",
        price: 200000,
    });
}
</script>

<template>
    <header>
        <h1>{{ car.name }}</h1>
        <h1>{{ car.price }}</h1>
        <button @click="changeCarName('Audi')">Change Car Name</button>
        <button @click="changeCar">Wrong Change Car</button>
        <button @click="correctChangeCar">Correct Change Car</button>
    </header>
</template>
```

## toRefs & toRef

-   解構賦值的影響：`let { name, age } = person` 的操作只是將 person 物件中的值解構並複製給變數 `name` 和 `age`，這些變數之後與 person 再無關聯，也就是他們只是普通的變數，而不是響應式的 `ref` 或 `reactive`。

```js
<script setup>
import { reactive } from 'vue'

let person = reactive({
  name: 'John',
  age: 20,
})

let { name, age } = person

function changeName(newName) {
  name = newName
}

function changeAge(newAge) {
  age = newAge
}
</script>

<template>
  <header>
    <h1>{{ name }}</h1>
    <h1>{{ age }}</h1>
    <button @click="changeName('Jane')">Change Name</button>
    <button @click="changeAge(21)">Change Age</button>
  </header>
</template>
```

所以要解決這個問題，我們需要使用 `toRefs` 或 `toRef` 來將 `person` 物件中的屬性轉換為響應式的 `ref` 或 `reactive`。

-   `toRefs` 會將 `person` 物件中的`所有屬性`轉換為響應式的 `ref`。
-   `toRef` 會將 `person` 物件中的`指定屬性`轉換為響應式的 `ref`。

```js
<script setup>
import { reactive, toRefs, toRef } from 'vue'

let person = reactive({
  name: 'John',
  age: 20,
})

let { name, age } = toRefs(person)

// or
// let name = toRef(person, 'name')
// let age = toRef(person, 'age')

function changeName(newName) {
  name.value = newName
}

function changeAge(newAge) {
  age.value = newAge
}
</script>
```

## computed

如果要把 firstName 的首字母大寫，可以這樣寫：

```js
<script setup>
import { ref } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')
</script>

<template>
  <header>
    <input v-model="firstName" />
    <input v-model="lastName" />
    <p>{{ firstName.slice(0, 1).toUpperCase() + firstName.slice(1) }} - {{ lastName }}</p>
  </header>
</template>
```

但這樣寫的話會不好維護，我們需要讓 template 保持簡潔，所以可以使用 computed 來寫，當 firstName 和 lastName 改變時，computed 會自動更新：

```js
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => `${firstName.value.slice(0, 1).toUpperCase() + firstName.value.slice(1)} - ${lastName.value}`)
</script>

<template>
  <header>
    <input v-model="firstName" />
    <input v-model="lastName" />
    <p>{{ fullName }}</p>
  </header>
</template>
```

計算屬性只會計算一次，所以當你多次使用時，會得到相同的結果，並不會重新計算。

```js
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => `${firstName.value.slice(0, 1).toUpperCase() + firstName.value.slice(1)} - ${lastName.value}`)
</script>

<template>
  <header>
    <input v-model="firstName" />
    <input v-model="lastName" />
    <p>{{ fullName }}</p>
    <p>{{ fullName }}</p>
    <p>{{ fullName }}</p>
    <p>{{ fullName }}</p>
    <p>{{ fullName }}</p>
  </header>
</template>
```

如果需要`直接修改`計算屬性，可以在 computed 中使用 `set` 方法。

如果不這麼寫，直接修改 `fullName` 的話，會得到 `[Vue warn] Write operation failed: computed value is readonly` 錯誤。

```js
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (newValue) => {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```
