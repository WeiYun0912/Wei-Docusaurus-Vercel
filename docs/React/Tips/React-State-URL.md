---
title: "[react] React State 放在 URL 的好處"
keywords: [react, react教學]
description: React State 放在 URL 的好處
author: WeiYun0912
og:title: React State 放在 URL 的好處
og:description: React State 放在 URL 的好處
---

## 說明

這篇主要介紹為什麼要考慮把 React 的 state 放在 URL。

[影片介紹](https://www.youtube.com/watch?v=-ScajqKRzOs)

## 使用 useState

假設我們的畫面中有一個功能，是可以讓使用者選取電影名稱並給予評價，選取的電影名稱和評價也會有對應的 style，如下圖：

![Image](https://i.imgur.com/fvrRASV.png)

程式碼如下，我們使用 useState 來記錄使用者選取了哪部電影以及評價為何。

```jsx title='App.jsx' showLineNumbers {8,9,11-12,30,40}
import { useState } from "react";

const movies = ["Toy Story", "Elemental"];

const stars = ["1", "2", "3", "4", "5"];

function App() {
  const [movieSelected, setMovieSelected] = useState("");
  const [starSelected, setStarSelected] = useState("");

  const selectedStyle = (selectedValue, targetValue) =>
    selectedValue === targetValue ? "border-blue-500" : "";

  return (
    <>
      <div className="flex flex-col gap-4">
        {movieSelected && (
          <img
            src={poster[movieSelected]}
            width={100}
            alt="movie poster"
            className="m-auto"
          />
        )}
        <div className="flex gap-2">
          {movies.map((movie) => (
            <div
              key={movie}
              className={`${selectedStyle(movie, movieSelected)} movie`}
              onClick={() => setMovieSelected(movie)}
            >
              <p>{movie}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 items-center justify-center">
          {stars.map((star) => (
            <div
              key={star}
              onClick={() => setStarSelected(star)}
              className={`${selectedStyle(star, starSelected)} star`}
            >
              <p>{star}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

而如果我們現在想把`選取好的結果`複製下來，分享出去，或是將網址分享給其他人，讓其他人看到我們選取的結果，你會發現目前沒有辦法做到這個功能，這是因為我們使用了 `useState`，只要畫面重新整理，state 都會被重置。

## 使用 useSearchParams

要實作上述提到的功能，我們可以使用 `react-router-dom` 提供的 `useSearchParams` 來更改與取得網址的參數(query string)，而當使用者選取電影及評價時，就將選取的結果儲存至網址(URL)。

假設網址是 `http://127.0.0.1:5173/`，當使用者選取電影和評價時，我們可以透過 `useSearchParams` 將網址設定成 `http://127.0.0.1:5173/?movie=Toy+Story&star=5`。

先將原先使用 useState 記錄的結果換成 useSearchParams，並使用 get 方法來取得網址的參數：

```jsx title='App.jsx' showLineNumbers
// const [movieSelected, setMovieSelected] = useState("");
// const [starSelected, setStarSelected] = useState("");

const [searchParams, setSearchParams] = useSearchParams({
  movie: "",
  star: "",
});

const movieSelected = searchParams.get("movie"); //取得 query string 名稱為 movie 的值

const starSelected = searchParams.get("star"); //取得 query string 名稱為 star 的值
```

接著實作更改網址的 function：

```jsx title='App.jsx' showLineNumbers
const handleClick = (selected, qsType) => {
  setSearchParams(
    (prev) => {
      // qsType 為 query string 的名稱
      // selected 為選取的結果
      // 假設 qsType 是 movie，selected 是 Toy Story
      // 使用 set 後，網址為變成 xxx://?movie=Toy+Story
      prev.set(qsType, selected);
      return prev;
    },
    // replace : true 的意思是不要留下 history，讓使用者無法回到上一步(上一頁)
    { replace: true }
  );
};
```

最後將 function 放到元素的 onClick 內，並傳入 query string 的名稱：

```jsx title='App.jsx' showLineNumbers {1,8-11,13,15,17-25,47,59}
import { useSearchParams } from "react-router-dom";

const movies = ["Toy Story", "Elemental"];

const stars = ["1", "2", "3", "4", "5"];

function App() {
  const [searchParams, setSearchParams] = useSearchParams({
    movie: "",
    star: "",
  });

  const movieSelected = searchParams.get("movie");

  const starSelected = searchParams.get("star");

  const handleClick = (selected, qsType) => {
    setSearchParams(
      (prev) => {
        prev.set(qsType, selected);
        return prev;
      },
      { replace: true }
    );
  };

  const selectedStyle = (selectedValue, targetValue) =>
    selectedValue === targetValue ? "border-blue-500" : "";

  return (
    <>
      <div className="flex flex-col gap-4">
        {movieSelected && (
          <img
            src={poster[movieSelected]}
            width={100}
            alt="movie poster"
            className="m-auto"
          />
        )}
        {movieSelected && <p>Movie Name : {movieSelected}</p>}
        <div className="flex gap-2 flex-wrap">
          {movies.map((movie) => (
            <div
              key={movie}
              className={`${selectedStyle(movie, movieSelected)} movie`}
              onClick={() => handleClick(movie, "movie")}
            >
              <p>{movie}</p>
            </div>
          ))}
        </div>
        {starSelected && <p>You give {starSelected} star.</p>}
        <div className="flex gap-2 items-center justify-center">
          {stars.map((star) => (
            <div
              key={star}
              className={`${selectedStyle(star, starSelected)} star`}
              onClick={() => handleClick(star, "star")}
            >
              <p>{star}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

但最後還是要說一下，`並不是所有的 state 都適合放到 URL`。
