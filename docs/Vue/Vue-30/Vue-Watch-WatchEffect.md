---
title: "[vue] Vue Watch 和 WatchEffect"

keywords: [vue3, watch, watchEffect]

description: Vue Watch 和 WatchEffect 。

author: WeiYun0912

og:title: "[vue, watch, watchEffect] Vue Watch 和 WatchEffect"

og:description: "Vue Watch 和 WatchEffect"

sidebar_position: 3
---

# Vue Watch 和 WatchEffect

## watch

使用 watch 的時候，也會給 stop 方法，可以停止監聽。

```js
const stopWatch = watch(firstName, (newVal, oldVal) => {
    if (newVal === "John") {
        stopWatch();
    }
});
```

### reactive 和 ref 的 watch

這兩種的 watch 的差別在於，reactive 預設是深層(deep)監聽且無法關閉深層監聽，ref 預設是淺層(shallow)監聽。

```js
<script setup>
import { watch, ref, reactive } from "vue";

const person1 = ref({
    name: "John",
    age: 20,
});

const person2 = reactive({
    name: "John",
    age: 20,
});

watch(person1, (newVal, oldVal) => {
    console.log(`firstName changed from ${oldVal} to ${newVal}`);
});

watch(person2, (newVal, oldVal) => {
    console.log(`firstName changed from ${oldVal} to ${newVal}`);
});
</script>
```

### 監聽物件的屬性

如果需要監聽物件的屬性，可以使用 `() => person.value.name` 來監聽。

```js
<script setup>
import { reactive, watch } from 'vue'

const person = reactive({
  name: 'John',
  age: 20,
})

watch(
  () => person.name,
  (newName) => {
    console.log(newName)
  },
)
</script>
```

### 監聽多個響應式數據

如果需要監聽多個響應式數據，可以在監聽的時候用陣列將多個響應式數據傳入，並在 callback 中使用 `newValues` 來取得多個響應式數據的值。

```vue
<script setup>
import { watch, ref } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

watch([firstName, lastName], (newValues) => {
    // 這裡的 newValues 是陣列，裡面包含所有監聽的響應式數據的值
    console.log(newValues);
});
</script>
```

## watchEffect

如果要監聽的響應式數據較多，可以使用 watchEffect 來監聽。

watchEffect 會在初始化時執行一次，並在依賴的響應式數據變化時重新執行。

```js
<script setup>
import { watchEffect, ref } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

watchEffect(() => {
    if (firstName.value === "John" && lastName.value === "Doe") {
        console.log("John Doe");
    }
});
</script>
```
