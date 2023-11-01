---
title: "[vscode] 5 個實用的 VS Code 擴充套件 (extensions)"
keywords: [vscode, vscode extensions, extensions]
description: 5 個實用的 VS Code 擴充套件
author: WeiYun0912
og:title: 5 個實用的 VS Code 擴充套件
og:description: 5 個實用的 VS Code 擴充套件
sidebar_position: 1
---

[影片介紹](https://youtu.be/sfCslGcP1G4)

## Better Comments

![Image](https://i.imgur.com/W6XP2dx.png)

當你在撰寫程式碼註解的時候，有時候會需要撰寫該程式碼的用途以及注意事項等等，這時候就可以使用 `Better Comments` 來協助你區分這幾件事。

只要在註解的地方使用以下幾種符號，你的註解就會有不同的顏色，而該套件針對符號的定義如下(不侷限於 function)：

- <h4 style={{color : "#98C379"}}>* (important) : 該 function 有哪些重要的事項需注意</h4>
- <h4 style={{color : "#FF0000"}}>! (deprecated) : 棄用的 function</h4>
- <h4 style={{color : "#3498DB"}}>? (should...?) : 該 function 應該要做什麼嗎?</h4>
- <h4 style={{color : "#FF8C00"}}>todo : 該 function 的代辦事項</h4>

![Image](https://i.imgur.com/wtuKk6K.png)

我們也可以自訂義符號(文字)和顏色，在該 extension 的介面點擊齒輪，之後選 `Extension Settings`，會看到以下畫面，點擊 `Edit settings.json`

![Image](https://i.imgur.com/w1ixAv9.png)

我們自訂一個 `Hello World` 的文字

![Image](https://i.imgur.com/T5an4sK.png)

最後來看看效果

![Image](https://i.imgur.com/FEa23S3.png)

## Code Spell Checker

![Image](https://i.imgur.com/cj7Wl9S.png)

`Code Spell Checker` 可以幫助我們檢查單字是否拼錯(底下有藍色波浪線)，有時候 function 或 variable 名稱拼錯的話，會覺得這個套件很讚，缺點是有一些第三方套件的命名並沒有被加進 Code Spell Checker 的字典裡，所以也會顯示警告提示。

![Image](https://i.imgur.com/tJK0ryt.png)

![Image](https://i.imgur.com/V2EFzAZ.png)

## Error Lens

![Image](https://i.imgur.com/9uDv7G8.png)

如果我們要查看程式的錯誤或警告訊息，需要將滑鼠移到錯誤發生的位置，才會顯示詳細資訊，但安裝了 `Error Lens` 後，錯誤和警告訊息會直接顯示在畫面上：

![Image](https://i.imgur.com/nF3lYSM.png)

## Pretty TypeScript Errors

![Image](https://i.imgur.com/4qnkbrc.png)

`Pretty TypeScript Errors` 可以幫我們修飾 typescript 的 error 訊息，畫面如下：

![Image](https://i.imgur.com/xk29xqD.png)

## Paste JSON as Code

![Image](https://i.imgur.com/8eWZH0R.png)

`Paste JSON as Code` 可以幫助我們將 json 格式的檔案轉換成 typescript 的 interface：

![Image](https://i.imgur.com/Ai6CKFh.gif)
