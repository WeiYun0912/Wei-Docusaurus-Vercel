---
title: "[typescript] React Batter Wrapper Component (ComponentProps,ComponentPropsWithoutRef)"
keywords: [javascript, typescript]
description: "介紹一下怎麼建立更彈性化的 Wrapper Component"
author: WeiYun0912
og:title: "[typescript] React Batter Wrapper Component (ComponentProps,ComponentPropsWithoutRef)"
og:description: "React Batter Wrapper Component (ComponentProps,ComponentPropsWithoutRef)"
sidebar_position: 1
---

[影片介紹](https://youtu.be/e0tU0iXoEzg)

## 介紹

持續記錄在 udemy 的 ts 課程學到的東西，這次要介紹的是怎麼使用 `ComponentPropsWithoutRef` 來建立彈性化的 Wrapper Component。

## 問題點

現在有一個 `Input` component，程式碼如下，可以看到我們設定只能接收 `id` 和 `label` props。

```tsx title='.tsx' showLineNumbers
type InputProps = {
  id: string;
  label: string;
};

const Input = ({ id, label, ...props }: InputProps) => {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </p>
  );
};

export default Input;
```

所以在使用 `Input` 的時候，我們只能傳入這兩個 props，如果傳入 `type` 或其他原生 HTML input 能夠使用的 attribute ，就會出現錯誤，因為 `type` 和 `placeholder` 並沒有定義在我們的 `InputProps` 裡面，但我們又不可能針對每一個 HTML element 的 attribute 去定義屬於它的 type。

```tsx title='App.tsx' showLineNumbers
import Input from "./components/Input";

function App() {
  return (
    <main>
      <Input
        id="name"
        label="Your name"
        // error
        type="text"
        // error
        placeholder="Your name ..."
      />
      <Input
        id="age"
        label="Your age"
        // error
        type="number"
        // error
        placeholder="Your age ..."
      />
    </main>
  );
}

export default App;
```

## 解決方法 (ComponentPropsWithoutRef)

還好 React 有提供 `ComponentPropsWithoutRef` 來解決這個問題，`ComponentPropsWithoutRef` 是一個泛型，使用的方法很簡單，只要傳入 HTML element 的 tag 名稱即可。

```tsx title='Input.tsx' showLineNumbers
import { ComponentPropsWithoutRef } from "react";

type InputProps = {
  id: string;
  label: string;
} & ComponentPropsWithoutRef<"input">;

const Input = ({ id, label, ...props }: InputProps) => {
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...props} />
    </p>
  );
};

export default Input;
```

現在回到 `App`，在 `Input` component 上按下 `ctrl+i`，就會看到原生 HTML input 能夠使用的 attribute 了。

![Image](https://i.imgur.com/BcOwATE.png)

## 補充

其實不只有 `ComponentPropsWithoutRef` 可以使用，還有 `ComponentProps` 和 `ComponentPropsWithRef`，用法也和字面上的意思一樣，如果 component 有傳入 ref 的話，就使用 `ComponentPropsWithRef`，差別就是讓維護的人看到就知道該 component 是需要接收 ref 的，而如果單純使用 `ComponentProps` 的話也可以，只是就沒辦法明確的知道 component 需不需要傳入 ref。

`ComponentPropsWithoutRef` 和 `ComponentPropsWithRef` 的缺點就是命名過長。

## 參考資料

[React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/#componentprops)

[ComponentProps: React's Most Useful Type Helper](https://www.totaltypescript.com/react-component-props-type-helper)

udemy 課程 React & TypeScript - The Practical Guide Academind by Maximilian Schwarzmüller, Maximilian Schwarzmüller
