---
title: "[react] React i18next (多國語系切換套件)"
keywords: [react, react教學, react-i18next]
description: React-i18next 是一個在 React 應用程式中實現國際化（i18n）的強大工具。它建立在 i18next 套件的基礎上，提供了對於多語言支援的便利性和彈性。
author: WeiYun0912
og:title: React i18next
og:description: React-i18next 是一個在 React 應用程式中實現國際化（i18n）的強大工具。它建立在 i18next 套件的基礎上，提供了對於多語言支援的便利性和彈性。
---

[影片介紹](https://www.youtube.com/watch?v=2ai86BH6ok4&ab_channel=WeiWei)

[程式碼](https://github.com/WeiYun0912/react-i18n-demo)

## 安裝相關指令

```
npm i i18next i18next-browser-languagedetector i18next-intervalplural-postprocessor react-i18next
```

## 資料夾結構

```
src
|
|─── i18n.js
|
└─── locales
│   │   en
|   └──── translation.json
|   |   zh
|   └──── translation.json
```

## 語系資源

```json title='src/locales/en/translation.json' showLineNumbers
{
  "content": {
    "Header": "Pokemon Scarlet and Violet Effort Values List (Paldea)",
    "TableHead1": "Paldea Dex ID",
    "TableHead2": "Pokemon Image",
    "TableHead3": "Pokemon Name",
    "TableHead4": "Pokemon EV",
    "TableRowsPerPage": "Rows per page:",
    "EV1": "HP",
    "EV2": "Attack",
    "EV3": "Denfense",
    "EV4": "Sp.Attack",
    "EV5": "Sp.Defense",
    "EV6": "Speed",
    "Input": "Search Pokemon Name or ID"
  }
}
```

```json title='src/locales/zh/translation.json' showLineNumbers
{
  "content": {
    "Header": "寶可夢 朱/紫 努力值清單 (帕底亞地區)",
    "TableHead1": "編號",
    "TableHead2": "寶可夢圖片",
    "TableHead3": "寶可夢名稱",
    "TableHead4": "努力值",
    "TableRowsPerPage": "一頁顯示的寶可夢數量:",
    "EV1": "HP",
    "EV2": "攻擊",
    "EV3": "防禦",
    "EV4": "特攻",
    "EV5": "特防",
    "EV6": "速度",
    "Input": "輸入寶可夢名稱或圖鑑編號"
  }
}
```

## 初始化 i18n 檔案

在 `i18n.js` 檔案中，首先引入 `i18n`、`initReactI18next` 和語系資源，然後使用 `i18n.use()` 進行初始化。同時，將預設語系設定為中文（zh）。如果網站找不到中文語系的資源，系統將自動回退並讀取英文（en）的資源，這是因為我們有設定 `fallbackLng` 的關係。

```js title='src/i18n.js' showLineNumbers
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationZH from "./locales/zh/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  zh: {
    translation: translationZH,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "zh",
  fallbackLng: "en",
});
```

:::note
resources 內建立的語系名稱，像是 `en` 和 `zh`，在日後要切換語系的時候，需要將該名稱給帶入。
:::

## 引入插件

在一開始的時候有安裝 `i18next-browser-languagedetector` 和 `i18next-intervalplural-postprocessor` 這兩個插件，現在也將這兩個插件一併引入做使用：

- i18next-browser-languagedetector：會自動偵測使用的瀏覽器的語系，如果有對應到 resources 內定義的名稱就會切換過去。
- i18next-intervalplural-postprocessor：用來處理英文複數的套件，後面會介紹到。

```js title='src/i18n.js' showLineNumbers {3,4}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import intervalPlural from "i18next-intervalplural-postprocessor";
import translationEN from "./locales/en/translation.json";
import translationZH from "./locales/zh/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  zh: {
    translation: translationZH,
  },
};

i18n.use(initReactI18next).use(intervalPlural).use(LanguageDetector).init({
  resources,
  lng: "zh",
  fallbackLng: "en",
});
```

## 引入 i18n

初始化完畢後，在 `main.jsx` 直接引入 `i18n.js`：

```jsx title='src/main.jsx' showLineNumbers {5}
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./i18n.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## useTranslation

初始化完成後，就可以在 `App.jsx` 引入 `useTranslation`，並將 `t` 和 `i18n` 解構。

透過 t 可以取得我們在語系檔（json）裡面定義的文字，只要將對應的 key 帶進去即可：

```jsx title='src/App.jsx' showLineNumbers
import "./App.css";
import { useTranslation, Trans } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  return (
    <>
      {/* 中文語系輸出：寶可夢 朱/紫 努力值清單 (帕底亞地區) */}
      {/* 英文語系輸出：Pokemon Scarlet and Violet Effort Values List (Paldea) */}
      <p>{t("content.Header")}</p>
    </>
  );
}

export default App;
```

要切換不同語系也很簡單，只要使用 `i18n.changeLanguage("語系名稱")` 即可：

```jsx title='src/App.jsx' showLineNumbers
import "./App.css";
import { useTranslation, Trans } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const changeLng = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <button onClick={() => changeLng("en")}>EN</button>

      <button onClick={() => changeLng("zh")}>ZH</button>

      <br />
      {/* 中文語系輸出：寶可夢 朱/紫 努力值清單 (帕底亞地區) */}
      {/* 英文語系輸出：Pokemon Scarlet and Violet Effort Values List (Paldea) */}
      <p>{t("content.Header")}</p>
    </>
  );
}

export default App;
```

## Interpolation

如果要在語系檔案內使用外部變數，可以使用 `{{variable}}`。

```json title='src/locales/en/translation.json' showLineNumbers
{
  "greet": "Hello {{name}}",
  "content": {
    "Header": "Pokemon Scarlet and Violet Effort Values List (Paldea)",
    "TableHead1": "Paldea Dex ID",
    "TableHead2": "Pokemon Image",
    "TableHead3": "Pokemon Name",
    "TableHead4": "Pokemon EV",
    "TableRowsPerPage": "Rows per page:",
    "EV1": "HP",
    "EV2": "Attack",
    "EV3": "Denfense",
    "EV4": "Sp.Attack",
    "EV5": "Sp.Defense",
    "EV6": "Speed",
    "Input": "Search Pokemon Name or ID"
  }
}
```

```json title='src/locales/zh/translation.json' showLineNumbers
{
  "greet": "哈囉 {{name}}",
  "content": {
    "Header": "寶可夢 朱/紫 努力值清單 (帕底亞地區)",
    "TableHead1": "編號",
    "TableHead2": "寶可夢圖片",
    "TableHead3": "寶可夢名稱",
    "TableHead4": "努力值",
    "TableRowsPerPage": "一頁顯示的寶可夢數量:",
    "EV1": "HP",
    "EV2": "攻擊",
    "EV3": "防禦",
    "EV4": "特攻",
    "EV5": "特防",
    "EV6": "速度",
    "Input": "輸入寶可夢名稱或圖鑑編號"
  }
}
```

```jsx title='src/App.jsx' showLineNumbers
import "./App.css";
import { useTranslation, Trans } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const changeLng = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <button onClick={() => changeLng("en")}>EN</button>

      <button onClick={() => changeLng("zh")}>ZH</button>

      <br />
      {/* 中文語系輸出：哈囉 Wei */}
      {/* 英文語系輸出：Hello Wei */}
      <p>{t("name", { name: "Wei" })}</p>
    </>
  );
}

export default App;
```

## Plural

在英文語系中，可能會遇到單字是否需要加上複數形式的問題。而 i18next 套件已經為我們處理了這個問題，只需要稍微修改 json 檔案內的 key 即可：

```json title='src/locales/en/translation.json' showLineNumbers
{
  "greet": "Hello {{name}}",
  "count_one": "{{count}} item",
  "count_other": "{{count}} items",
  "content": {
    "Header": "Pokemon Scarlet and Violet Effort Values List (Paldea)",
    "TableHead1": "Paldea Dex ID",
    "TableHead2": "Pokemon Image",
    "TableHead3": "Pokemon Name",
    "TableHead4": "Pokemon EV",
    "TableRowsPerPage": "Rows per page:",
    "EV1": "HP",
    "EV2": "Attack",
    "EV3": "Denfense",
    "EV4": "Sp.Attack",
    "EV5": "Sp.Defense",
    "EV6": "Speed",
    "Input": "Search Pokemon Name or ID"
  }
}
```

```jsx title='src/App.jsx' showLineNumbers
import "./App.css";
import { useTranslation, Trans } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const changeLng = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <button onClick={() => changeLng("en")}>EN</button>

      <button onClick={() => changeLng("zh")}>ZH</button>

      <br />
      {/* 英文語系輸出：1 item */}
      <p>{t("count", { count: 1 })}</p>
      {/* 英文語系輸出：2 items */}
      <p>{t("count", { count: 2 })}</p>
    </>
  );
}

export default App;
```

但如果需要更客製化的定義複數範圍的話，就需要使用到 `intervalPlural` 插件，在一開始的時候我們已經有引入了，所以不用額外設定，只要在 key 名稱後面加上 `_interval`：

```json title='src/locales/en/translation.json' showLineNumbers
{
  "greet": "Hello {{name}}",
  "count_one": "{{count}} item",
  "count_other": "{{count}} items",
  "count_interval": "(1)[one item];(2-7)[a few items];(10-inf)[a lot of items];",
  "content": {
    "Header": "Pokemon Scarlet and Violet Effort Values List (Paldea)",
    "TableHead1": "Paldea Dex ID",
    "TableHead2": "Pokemon Image",
    "TableHead3": "Pokemon Name",
    "TableHead4": "Pokemon EV",
    "TableRowsPerPage": "Rows per page:",
    "EV1": "HP",
    "EV2": "Attack",
    "EV3": "Denfense",
    "EV4": "Sp.Attack",
    "EV5": "Sp.Defense",
    "EV6": "Speed",
    "Input": "Search Pokemon Name or ID"
  }
}
```

```jsx title='src/App.jsx' showLineNumbers
import "./App.css";
import { useTranslation, Trans } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const changeLng = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <button onClick={() => changeLng("en")}>EN</button>

      <button onClick={() => changeLng("zh")}>ZH</button>

      <br />

      {/* 英文語系輸出：one item */}
      <p>{t("count_interval", { postProcess: "interval", count: 1 })}</p>

      {/* 英文語系輸出：one item */}
      <p>{t("count_interval", { postProcess: "interval", count: 3 })}</p>

      {/* 英文語系輸出：a lot of items */}
      <p>{t("count_interval", { postProcess: "interval", count: 10 })}</p>
    </>
  );
}

export default App;
```
