---
title: "[javascript] JavaScript 常用的字串方法"
keywords: [javascript,string,replace,replace regex]
description: [javascript] JavaScript 常用的字串方法
author: WeiYun0912
og:title: [javascript] JavaScript 常用的字串方法
og:description: [javascript] JavaScript 常用的字串方法
---

## 說明

介紹一下個人在 JavaScript 常用的 String Function。

[影片介紹](https://www.youtube.com/watch?v=BwTiji7VkuA&ab_channel=WeiWei)

## trim

`trim` 可以將字串的`前後`空白給取代掉，但不會取代中間的空格：

```js title='sandbox.js' showLineNumbers
let str = "       hello World Hello World  ";

let strTrim = str.trim();

strTrim; // 輸出hello World Hello World
```

## indexOf & lastIndexOf

如果想要找某個字串出現的位置(index)，可以用 `indexOf` 和 `lastIndexOf`：

```js title='sandbox.js' showLineNumbers
let str = "hello World Hello World";

let strIndexOf = str.indexOf("World");

strIndexOf; // 輸出6，因為 World 在 str 出現的位置在 index 6 (從0開始算)
```

而 lastIndexOf 則是找該字串`最後一次`出現的位置(index)：

```js title='sandbox.js' showLineNumbers
let str = "hello World Hello World";

let strIndexOf = str.lastIndexOf("World");

strIndexOf; // 輸出18，因為 World 在 str 最後出現的位置在 index 18 (從0開始算)
```

## charAt

如果想要取得字串的某個字元，可以使用 `charAt`：

```js title='sandBox.js' showLineNumbers
let str = "hello World Hello World";

let strFirst = str.charAt(0); // 取得 str 的第一個字元

strFirst; // 輸出h
```

## slice

要取得字串的`某一段文字`可以使用 `slice`：

```js title='sandBox.js' showLineNumbers
let str = "hello World Hello World";

let strSlice = str.slice(1); // 從 index 1 開始取字串

strFirst; // 輸出ello World Hello World
```

要是傳入的 index 是 `負數` 的話，則從字串的`最後面`開始往前取：

```js title='sandBox.js' showLineNumbers
let str = "hello World Hello World";

let strSlice = str.slice(-1);

strFirst; // 輸出d

strFirst = str.slice(-5);

strFirst; // 輸出 World
```

也可以給定一個範圍：

```js title='sandBox.js' showLineNumbers
let str = "hello World Hello World";

let strFirst = str.slice(0, 5); // 從 index 0 開始取字串，到 index 5 為止 (不包括 index 5)

strFirst; // 輸出hello
```

我們可以結合 `charAt` 和 `slice` 來將一段字串的首字元變成大寫：

```js title='sandBox.js' showLineNumbers
let str = "hello World Hello World";

let strFirstCharUpperCase = str.charAt(0).toUpperCase() + str.slice(1);

strFirstCharUpperCase; //輸出Hello World Hello World
```

## replace

如果想要把字串內的`某個字串取代成其他字串的話`，則可以使用 replace：

```js title='sandBox.js' showLineNumbers
let str = "hello World hello World";

let strReplace = str.replace("hello", "Hello!!"); // 在 str 中尋找 hello 並取代成 Hello!!

strReplace; // 輸出Hello!! World Hello World
```

上述的範例會有個問題，你會發現我們的字串`有兩個hello`，但 replace 只幫我們取代一個而已，這是因為 `replace 只會尋找第一個符合條件的字串後將其取代`，並不會繼續尋找下一個匹配的字串。

如果你今天希望只要有匹配到的字串都要被取代，則可以在 replace 內使用正規表達式：

```js title='sandBox.js' showLineNumbers
let str = "hello World Hello World";

let strReplace = str.replace(/hello/gi, "Hello!!"); //使用正規表達式匹配字串 i 代表不管大小寫，g 代表連續匹配。

strReplace; // 輸出Hello!! World Hello!! World
```

## replace callback

replace 還有一個 callback function 可以使用，而較常使用的參數為 `match` 和 `index`。

- match：被匹配到的字串
- index：被匹到到的字串的 index 位置

```js title='sandBox.js' showLineNumbers
let str = "hello World Hello World";

let strReplace = str.replace(/hello/gi, (match, index) => {
  //round 1 : 輸出hello 0
  //round 2 : 輸出Hello 12
  console.log(match, index);
});
```

所以要讓某個字串的首字轉換成大寫的話也可以這樣寫：

```js title='sandBox.js' showLineNumbers
let str = "hello World hello World";

let strReplace = str.replace(/hello/gi, (match, index) => {
  return match[0].toUpperCase() + match.slice(1);
});

strReplace; //輸出Hello World Hello World
```

## split

如果要將`字串切割`的話，可以使用 `split`，使用 split 後，會回傳一個陣列：

```js title='sandBox.js' showLineNumbers
let str = "hello World hello World";

let strSplit = str.split(" "); // 空格做為依據 做字串切割

strSplit; //輸出 [ 'hello', 'World', 'hello', 'World' ]
```

## join

`join` 通常會配合 split 一起使用，所以就順便介紹，join 的意思是在陣列中，`元素跟元素之間你想要加入什麼字元`。

```js title='sandBox.js' showLineNumbers
let str = "hello World hello World";

let strSplit = str.split(" ").join("-"); //在元素之間加入 -

strSplit; //輸出hello-World-hello-World
```
