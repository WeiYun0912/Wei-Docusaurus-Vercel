---
title: "[typescript] React Component Discriminated Unions (可辨識複合型別)"
keywords: [javascript, typescript]
description: "今天要介紹如何使用 typescript 的 discriminated unions 來建立更彈性化的 component。"
author: WeiYun0912
og:title: "[typescript] React Component Discriminated Unions (可辨識複合型別)"
og:description: "React Component Discriminated Unions (可辨識複合型別)"
sidebar_position: 1
---

## 介紹

今天要介紹如何使用 typescript 的 discriminated unions 來建立更彈性化的 component。

## 問題點

直接看範例程式碼，在 `App` 內我們根據 `goals` 的長度來去決定 `InfoBox` 這個 component 要帶入的參數(props)是什麼。

```tsx title='App.tsx' showLineNumbers {8,15}
type CourseGoalListProps = {
  goals: CGoal[];
  onDeleteGoal: (id: number) => void;
};

const App = ({ goals, onDeleteGoal }: CourseGoalListProps) => {
  if (goals.length === 0) {
    return <InfoBox mode="hint">You have no course goals yet!</InfoBox>;
  }

  let warningBox: ReactNode;

  if (goals.length >= 4) {
    warningBox = (
      <InfoBox mode="warning" severity="high">
        You're collection a lot of goals!
      </InfoBox>
    );
  }

  return <>...</>;
};
```

而 `InfoBox` 的程式碼如下，我們可以看到 `InfoBox` 必須傳入 `mode`、`severity`、`children` 這三個 props，只要少一個就會出現錯誤。

所以現在 `App` 的`第 8 行`程式碼會出現 `Property 'severity' is missing in type '{ children: string; mode: "hint"; }' but required in type 'InfoBoxProps'.` 這個錯誤，因為我們少傳入了 `severity` 這個 prop。

但我們希望在 `goals.length === 0` 也就是 `mode === "hint"` 的時候，可以不用傳入 `severity`。

```tsx title='InfoBox.tsx' showLineNumbers
type InfoBoxProps = {
  mode: "warning" | "hint";
  severity: "low" | "medium" | "high";
  children: ReactNode;
};

const InfoBox = (props: InfoBoxProps) => {
  const { children, mode } = props;

  if (mode === "hint") {
    return (
      <aside className="infobox infobox-hint">
        <p>{children}</p>
      </aside>
    );
  }

  const { severity } = props;

  return (
    <aside className={`infobox infobox-warning warning--${severity}`}>
      <h2>Warning</h2>
      <p>{children}</p>
    </aside>
  );
};
```

## 解決方法 (1) Optional

這時候你可能會想說，把 `severity` 變成 optional(?) 的就好了吧？

```tsx title='InfoBox.tsx' showLineNumbers {3}
type InfoBoxProps = {
  mode: "warning" | "hint";
  severity?: "low" | "medium" | "high";
  children: ReactNode;
};

const InfoBox = (props: InfoBoxProps) => {
  const { children, mode } = props;

  if (mode === "hint") {
    return (
      <aside className="infobox infobox-hint">
        <p>{children}</p>
      </aside>
    );
  }

  const { severity } = props;

  return (
    <aside className={`infobox infobox-warning warning--${severity}`}>
      <h2>Warning</h2>
      <p>{children}</p>
    </aside>
  );
};
```

這樣做的確可行，但現在在 `goals.length >= 4` 也就是 `mode==="warning"` 的條件下去渲染 `InfoBox` 會有一個問題發生，就是即使我們不傳入 `severity` 也不會出現任何錯誤，這顯然不是我們想要的。

```tsx title='App.tsx' showLineNumbers {12,13}
...

const App = ({ goals, onDeleteGoal }: CourseGoalListProps) => {
  if (goals.length === 0) {
    return <InfoBox mode="hint">You have no course goals yet!</InfoBox>;
  }

  let warningBox: ReactNode;

  if (goals.length >= 4) {
    warningBox = (
    //  把 severity="high" 拿掉也不會出現錯誤
      <InfoBox mode="warning">
        You're collection a lot of goals!
      </InfoBox>
    );
  }

  return <>...</>;
};
```

## 解決方法 (2) Discriminated Unions

較佳的解決方式是使用 `Discriminated Unions`，程式碼如下，可以看到我們將 `mode 為 hint` 及 `mode 為 warning` 的 type 拆開來了，並且宣告 `InfoBoxProps` 為 `Discriminated Unions`。

```tsx title='InfoBox.tsx' showLineNumbers
type HintBoxProps = {
  mode: "hint";
  children: ReactNode;
};

type WarningInfoBoxProps = {
  mode: "warning";
  severity: "low" | "medium" | "high";
  children: ReactNode;
};

type InfoBoxProps = HintBoxProps | WarningInfoBoxProps;

const InfoBox = (props: InfoBoxProps) => {
  const { children, mode } = props;

  if (mode === "hint") {
    return (
      <aside className="infobox infobox-hint">
        <p>{children}</p>
      </aside>
    );
  }

  const { severity } = props;

  return (
    <aside className={`infobox infobox-warning warning--${severity}`}>
      <h2>Warning</h2>
      <p>{children}</p>
    </aside>
  );
};
```

這時候如果我們在 `mode = "warning"` 的時候，將 `severity` prop 拿掉，typescript 會出現 `Property 'severity' is missing in type '{ children: string; mode: "warning"; }' but required in type 'WarningInfoBoxProps'.` 錯誤，我們就知道必須傳入 `severity` prop。

```tsx title='App.tsx' showLineNumbers
const App = ({ goals, onDeleteGoal }: CourseGoalListProps) => {
  if (goals.length === 0) {
    return <InfoBox mode="hint">You have no course goals yet!</InfoBox>;
  }

  let warningBox: ReactNode;

  if (goals.length >= 4) {
    warningBox = (
      //  把 severity="high" 拿掉會出現錯誤
      <InfoBox mode="warning">You're collection a lot of goals!</InfoBox>
    );
  }

  return <>...</>;
};
```

而使用 `Discriminated Unions` 的好處還有一點，就是當我們在 `mode === "hint"` 的情況下，如果去解構 `severity`，則會出現 `Property 'severity' does not exist on type 'HintBoxProps'.` 錯誤。

因為 typescript 知道 `severity` 並不存在 `HintBoxProps` 內。

![Image](https://i.imgur.com/DqAZ9kz.png)

![Image](https://i.imgur.com/VPIU4JO.png)

如果改成 `warning` 的話，就不會出現這個錯誤，因為 `severity` 有存在 `WarningInfoBoxProps` 內。

![Image](https://i.imgur.com/00n36mF.png)

![Image](https://i.imgur.com/f7Bf3IY.png)

## 參考資料

udemy 課程 React & TypeScript - The Practical Guide Academind by Maximilian Schwarzmüller, Maximilian Schwarzmüller
