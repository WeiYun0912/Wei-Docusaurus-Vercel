---
title: "[lint] 檢查 git staged 的檔案是否符合 ESLint 規範 (git hook, husky, lint-staged, eslint)"

keywords: [husky, lint-staged, eslint]

description: 檢查 git staged 的檔案是否符合 ESLint 規範 (git hook, husky, lint-staged, eslint)

author: WeiYun0912

og:title: 檢查 git staged 的檔案是否符合 ESLint 規範 (git hook, husky, lint-staged, eslint)

og:description: 檢查 git staged 的檔案是否符合 ESLint 規範 (git hook, husky, lint-staged, eslint)
---

## 說明

記錄一下怎麼檢查 git staged 的檔案是否符合 ESLint 規範，先以 vue 專案為例，因為使用 `npx create-vue@latest` 可以快速幫我們建好 ESLint 的檔案和環境。

順便說一下，我的 demo 專案已經有初始化 git 了，所以要跟著操作的話，記得要先將專案的 git 環境設定好。

## 建立專案

先執行以下指令

```bash
npx create-vue@latest
```

然後在詢問是否安裝 `ESLint` 和 `Prettier` 的時候，選擇`是`。

![Image](https://i.imgur.com/J9x3GFA.png)

## eslint

當你打開專案的 `.eslintrc.cjs` 檔案時，可以在 `rules` 區塊中加入你常用的檢查規則，也就是你希望執行 `git commit` 後，套用哪些規則來檢查程式碼。

以下是我個人常用的規則。如果想了解這些規則檢查的程式碼問題，可以參考[這篇](/docs/Vue/Vue-ESLint)文章，這裡就不再詳細介紹了。

```js title='eslintrc.cjs' showLineNumbers
/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-prettier/skip-formatting",
  ],

  rules: {
    "vue/no-undef-components": "error",
    "vue/no-undef-properties": "error",
    "vue/eqeqeq": "warn",
    "vue/no-unused-properties": "error",
    "vue/no-unused-emit-declarations": "error",
    "array-callback-return": "error",
    eqeqeq: "warn",
  },

  parserOptions: {
    ecmaVersion: "latest",
  },
};
```

## 安裝 husky & lint-staged

`husky` 是讓我們可以很簡單使與快速使用 `git hook` 的工具，而 `lint-staged` 是用來幫我們檢查 git 暫存區(staged) 的檔案是否有符合 ESLint 規範的工具。

安裝 `husky` 和 `lint-staged`，並安裝在 `devDependencies`。

```
npm i husky lint-staged -D
```

## lint staged config

安裝完後，我們可以在 `package.json` 內新增 `lint-staged` 的屬性。

- line 4：因為我們在初始化專案的時候，已經有安裝 `Prettier` 了，所以可以直接使用 `prettier` 指令，來格式化 `src` 底下的檔案，這邊我們是指定了副檔名包含 js、html、css、vue 的檔案，這樣做是為了讓程式碼的風格統一，因為不一定所有人都有安裝 `Prettier` 並且把 `formatOnSave` 開啟。
- line 5：直接執行 `eslint` 指令，並加上 `--fix` 參數，當我們在 ESLint 中使用了 --fix 參數時，ESLint 會嘗試自動修復那些它認為可以自動修復的問題。這些問題可能包括但不限於：
  - 修復未關閉的大括號 {}。
  - 新增缺失的分號 ;。
  - 修復不必要的空白行。
  - 修復不必要的空格。
  - 修復不必要的換行。
  - 修復不必要的縮排。

```json showLineNumbers
{
  ...
  "lint-staged": {
    "src/**/*.{js.html.css.vue}": "prettier --write",
    "src/**/*.{js,vue}" : "eslint --fix"
  }
}
```

現在我們可以執行以下程式碼來測試 lint-staged

```
npx lint-staged
```

如果出現 `No staged files found.` 代表設定成功了，但目前我們的 git 暫存區是沒有任何檔案的。

![Image](https://i.imgur.com/HHM0QuZ.png)

## 初始化 husky

現在要在專案初始化 husky，讓我們可以使用 git hook 的功能。

```
npx husky-init
```

成功的話會看到以下畫面

![Image](https://i.imgur.com/SFbbbmJ.png)

並且在你的專案內，應該會看到 `.husky` 資料夾，並且裡面有一支檔案，叫做 `pre-commit`，這就是 git hook，讓我們在 commit 發送後，執行裡面的指令。

所以現在執行 `git commit` 的話，就會先執行 `npm test`。

```bash title='pre-commit' showLineNumbers
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm test
```

但我們並不想執行這個指令，所以把它替換為 `npx lint-staged`。

```bash title='pre-commit' showLineNumbers
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

## 提交檔案

現在我們將 `App.vue` 的程式碼改成以下

```jsx title='App.vue' showLineNumbers
<template>
  <div></div>
  {{ c }}

  <TestComponet />
</template>

<script setup>
const a = ''
const b = ''

const c = 1
const d = c == 1 ? 'a' : 'b'
</script>
```

如果你是套用我的 ESLint 規則，現在應該會看到以下紅通通的畫面。

![Image](https://i.imgur.com/qE2h8VA.png)

而現在我們將 `App.vue` 使用 git add 新增到暫存區。

```
git add .\src\App.vue
```

![Image](https://i.imgur.com/JmDMw6g.png)

現在執行以下指令

```git
git commit -m "你的 commit message"
```

你會發現我們的 commit 失敗了，並且出現以下訊息，告訴我們的 `App.vue` 有 4 個 errors，1 個 warning，這也就是我們 ESLint 裡面定義的 rules。

![Image](https://i.imgur.com/pbgjJS6.png)

現在把 `App.vue` 的程式碼改成以下，並重新執行 `git add`。

```jsx title='App.vue' showLineNumbers
<template>
  <p>{{ a }}</p>
</template>

<script setup>
const a = 'Hello'
</script>
```

再次 commit 後，會發現成功提交了。

![Image](https://i.imgur.com/Z3b1wg1.png)
