---
title: "[jest] Jest React (TypeScript) 環境設定"
keywords: [jest, react, typescript]
description: 記錄一下使用 Vite + React + TypeScript 的話，要怎麼設定 Jest 環境，以及如何 Testing Component。
author: WeiYun0912
og:title: Jest React (TypeScript) 環境設定
og:description: 記錄一下使用 Vite + React + TypeScript 的話，要怎麼設定 Jest 環境，以及如何 Testing Component。
sidebar_position: 1
---

## 說明

記錄一下使用 Vite + React + TypeScript 的話，要怎麼設定 Jest 環境，以及如何 Testing Component，該筆記是參考[這篇文章](https://codingwithmanny.medium.com/quick-jest-setup-with-vitejs-react-typescript-82f325e4323f)所寫的。

前置：

- Node 16.13.0 以上
- Yarn 1.22.0 以上

## 安裝相關套件

建立 React + TypeScript 的環境：

```
npm create vite@latest 你的專案名稱 -- --template react-ts
```

要安裝的套件有點多，所以可以直接複製以下的指令來進行安裝：

```
npm i -D jest @types/jest ts-node ts-jest @testing-library/react @testing-library/user-event identity-obj-proxy @testing-library/jest-dom @types/testing-library__jest-dom jest-environment-jsdom
```

:::note
記得在安裝的時候要加上 `-D`，才不會把測試用到的套件安裝到正式環境中。
:::

## 新增指令

接著打開 `package.json` 將 `test` 指令新增至 `scripts` 底下：

```json title='package.json' showLineNumbers {8}
{
  ...
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test" : "jest"
  },
  ...
}
```

接著在 Terminal 輸入以下指令：

```
npm run test
```

沒有意外的話會出現以下的錯誤，這是因為我們還沒有建立要 test 的檔案，而我們也必須遵循 `testMatch` 的條件，建立一個 `__tests__` 資料夾讓，並將要測試的檔案新增至該資料夾底下。

![Image](https://i.imgur.com/xqTU2zL.png)

## 新增測試檔案

在 `src` 資料夾底下新增 `__tests__` 資料夾並新增 `App.test.tsx` 檔案，接著將以下指令新增至該 `tsx` 檔案中。

```tsx title='__tests__/App.test.tsx' showLineNumbers
test("測試 App.tsx 頁面是否正常運作", () => {
  expect(true).toBeTruthy();
});
```

接著再輸入一次指令：

```
npm run test
```

成功的話就會在 Terminal 看到以下畫面。

![Image](https://i.imgur.com/Q4Ypww6.png)

## 測試 Component

在 `App.test.tsx` 將 `App Component` 引入：

```tsx title='__tests__/App.test.tsx' showLineNumbers
import App from "../App";

test("測試 App.tsx 頁面是否正常運作", () => {
  expect(true).toBeTruthy();
});
```

在執行一次測試指令：

```
npm run test
```

這時候會發現 Terminal 報錯，這是因為我們的 `App.tsx` 使用了非原生 JavaScript 的語法，又或是 Jest 尚未支援某語法就會出現此錯誤，而 Jest 提供了 5 種方法來解決這個錯誤，我們選擇第 4 種，使用 `transform` 來解決此問題。

![Image](https://i.imgur.com/WfP8bft.png)

在專案根目錄新增一個檔案，名為 `jest.config.ts`，並將以下程式碼貼上，把 `tsx` 結尾的檔案，使用 `ts-node` 的 `ts-jest` 來處理。

```ts title='jest.config.ts' showLineNumbers
export default {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
```

回到 `App.test.tsx` 檔案，將以下程式碼貼上：

```tsx title='__tests__/App.test.tsx' showLineNumbers
import { render } from "@testing-library/react";
import App from "../App";

test("測試 App.tsx 頁面是否正常運作", () => {
  render(<App />);

  expect(true).toBeTruthy();
});
```

執行測試指令：

```
npm run test
```

這時候又會看到新的錯誤出現，告訴我們圖片無法進行解析。

![Image](https://i.imgur.com/2jU4kqR.png)

在測試的時候，靜態資源可能不是我們測試的重點，所以官方也建議使用模擬(mock)的方式來將靜態資源做載入。

在根目錄新增資料夾 `test`，於該資料夾底下再新增一個資料夾 `__mocks__`，最後在 `__mocks__` 資料夾底下新增 `fileMock.js`，並將以下程式碼新增進去。

```js title='test/__mocks__/fileMock.js' showLineNumbers
module.exports = "test-file-stub";
```

最後打開 `jest.config.ts` 將以下程式碼新增進去，並將測試環境設定成 `jsdom`，而圖片檔使用 `fileMock.js` 處理，CSS 相關資源則使用 `identity-obj-proxy` 套件來處理。

```ts title='jest.config.ts' showLineNumbers {2,6-9}
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
};
```

最後更改一下 `App.test.tsx` 的程式碼：

```tsx title='App.test.tsx' showLineNumbers
import { render, screen } from "@testing-library/react";
import App from "../App";

test("測試 App.tsx 頁面是否正常運作", async () => {
  render(<App />);

  expect(true).toBeTruthy();
});

test("測試 App.tsx 的按鈕文字顯示是否正常", async () => {
  render(<App />);

  const button = await screen.findByRole("button");

  expect(button.innerHTML).toBe("count is 0");
});
```

執行測試指令：

```
npm run test
```

![Image](https://i.imgur.com/GstxUGU.png)

## 改變 Component State

現在模擬使用者點擊按鈕的事件，點擊按鈕後，count 會加 1，模擬點擊兩次以後來確認 count 是否為 2。

```tsx title='App.test.tsx' showLineNumbers
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../App";

test("測試 App.tsx 頁面是否正常運作", async () => {
  render(<App />);
  expect(true).toBeTruthy();
});

test("測試 App.tsx 的按鈕文字顯示是否正常", async () => {
  render(<App />);

  const button = await screen.findByRole("button");

  expect(button.innerHTML).toBe("count is 0");

  await user.click(button);
  await user.click(button);

  expect(button.innerHTML).toBe("count is 2");
});
```

![Image](https://i.imgur.com/7IMrVNo.png)

## 進階設定

如果想要測試的更仔細，例如：當 count 大於 0 的時候，某些文字才出現，則必須額外設定。

在根目錄新增一個檔案，名為 `jest.setup.ts`，並將以下程式碼新增進去：

```ts title='jest.setup.ts' showLineNumbers
import "@testing-library/jest-dom/extend-expect";
```

接著打開 `jest.config.ts`，新增 `setupFilesAfterEnv` 屬性，並將剛剛的檔案路徑新增進去：

```ts title='jest.config.ts' showLineNumbers {10}
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
```

設定完成後，將 `App.tsx` 的程式碼改為以下：

```tsx title='App.tsx' showLineNumbers {32}
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      {count > 0 ? <p>The count is greater then 0</p> : null}
    </>
  );
}

export default App;
```

而在測試檔案中，我們就可以使用 `toBeInTheDocument()` 更精準的進行測試：

```tsx title='App.test.tsx' showLineNumbers
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import App from "../App";

test("測試 App.tsx 頁面是否正常運作", async () => {
  render(<App />);
  expect(true).toBeTruthy();
});

test("測試 App.tsx 的按鈕文字顯示是否正常", async () => {
  render(<App />);

  const button = await screen.findByRole("button");

  const count = screen.queryByText(/The count is greater then/);

  expect(count).not.toBeInTheDocument();

  await user.click(button);
  await user.click(button);

  expect(screen.queryByText(/The count is greater then/)).toBeInTheDocument();
});
```

![Image](https://i.imgur.com/9vIvfkN.png)

## Property 'toBeInTheDocument' does not exist on type 'Matchers'

先安裝 `@types/testing-library__jest-dom`：

```
npm i -D @types/testing-library__jest-dom
```

在 `jest.setup.ts` 檔案中 import 以下套件：

```ts title='jest.setup.ts' showLineNumbers
import "@testing-library/jest-dom";
```

接著在 `jest.config.ts` 中增加以下指令：

```ts title='jest.config.ts' showLineNumbers
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
```

最後在 `tsconfig.json` 中，將 `src` 和 `jest.setup.ts` 加入至 `includes`：

```json title='tsconfig.json' showLineNumbers
{
    ...
    "include": [
        "src",
        "jest.setup.ts"
    ],
    ...
}
```

## 參考資料

[JEST](https://jestjs.io/docs/webpack)

[Quick Jest Setup With ViteJS, React, & TypeScript](https://codingwithmanny.medium.com/quick-jest-setup-with-vitejs-react-typescript-82f325e4323f)

[Property 'toBeInTheDocument' does not exist on type 'Matchers'](https://stackoverflow.com/questions/57861187/property-tobeinthedocument-does-not-exist-on-type-matchersany)
