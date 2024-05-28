---
title: "美化你的 Windows Terminal (oh-my-posh)"

keywords: [windows terminal, oh-my-posh]

description: 美化你的 Windows Terminal (oh-my-posh)

author: WeiYun0912

og:title: 美化你的 Windows Terminal (oh-my-posh)

og:description: 美化你的 Windows Terminal (oh-my-posh)
---

## 說明

記錄一下怎麼讓 Windows Terminal 能夠支援不同的主題

![Image](https://i.imgur.com/hJsLP6U.png)

## Windows Terminal

先下載 [Windows Terminal](https://apps.microsoft.com/detail/9n0dx20hk701?hl=zh-tw&gl=TW)

## 字體

先下載 [Nerd Fonts](https://github.com/ryanoasis/nerd-fonts/) 字體，在 [release](https://github.com/ryanoasis/nerd-fonts/releases) 的頁面找到你要用的字體並且下載，我這邊是跟參考資料用一樣的字體 `FiraCode`。

下載完將裡面的檔案解壓縮到隨便一個資料夾，把所有的字體全選，並點擊右鍵安裝。

![Image](https://i.imgur.com/o4jkIWk.png)

## 設定 Window Terminal 字體

點擊 Windows Terminal 旁邊 `+` 號的 `⬇`，之後點擊 `Settings`

![Image](https://i.imgur.com/6iVoEQn.png)

然後在左邊的 `Profiles` 找到 `Defaults`，並點擊 `Appearance`。

![Image](https://i.imgur.com/73WhT6c.png)

之後在 `Font face` 的地方選擇你剛剛安裝的字體

![Image](https://i.imgur.com/OArrQT9.png)

## Oh My Posh

[Oh My Posh](https://ohmyposh.dev/) 是一個開源的終端機提示工具，用於美化和自訂終端機的 prompt。

要安裝 `Oh My Posh` 的話，先確認一下有沒有 `winget` 這個套件管理工具。

在 `Windows Terminal` 執行 [winget](https://apps.microsoft.com/detail/9nblggh4nns1?rtc=1&hl=zh-tw&gl=TW#activetab=pivot:overviewtab)，有看到以下畫面的話代表是有安裝的。

![Image](https://i.imgur.com/JK9C40H.png)

如果沒有安裝 `winget` 的話，可以參考官方其他的[安裝方法](https://ohmyposh.dev/docs/installation/windows)。

## 安裝 Oh My Posh

這邊用 `winget` 來 demo 如何安裝，在 `Windows Terminal` 執行以下指令來安裝 `Oh My Posh`。

```
winget install JanDeDobbeleer.OhMyPosh -s winget
```

安裝完以後，在 `Windows Terminal` 執行以下指令。

```
oh-my-posh
```

![Image](https://i.imgur.com/mOx8GRr.png)

再執行以下指令，來套用預設主題。

```
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\jandedobbeleer.omp.json" | Invoke-Expression
```

![Image](https://i.imgur.com/gbgZV5w.png)

## Themes

如果不喜歡預設的主題，也可以[來這裡](https://ohmyposh.dev/docs/themes)挑你喜歡的主題。

找到喜歡的主題後，把`主題名稱`換成你想要的主題名稱。

```
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\主題名稱.omp.json" | Invoke-Expression
```

## 儲存主題

現在設定完以後，只要我們開新的 `Terminal`，會發現主題遺失了。

執行以下指令來查看自己的 `shell` 是哪種，然後在照著[官網](https://ohmyposh.dev/docs/installation/prompt)的步驟執行。

```
oh-my-posh get shell
```

我這邊以 `powershell` demo 怎麼儲存主題，

先執行以下指令來建立 `Microsoft.PowerShell_profile.ps1` 檔案，我們需要這個檔案來保存主題。

```
New-Item -Path $PROFILE -Type File -Force
```

之後使用 `notepad` 打開

```
notepad $PROFILE
```

把剛剛套用主題的指令貼到檔案內，然後儲存。

```
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\night-owl.omp.json" | Invoke-Expression
```

![Image](https://i.imgur.com/rVTGbgH.png)

最後再執行以下指令，就會看到主題更改成功了。

```
. $PROFILE
```

![Image](https://i.imgur.com/FeDjx0k.png)

## VS Code

要是 `VS Code` 的 `Terminal` 有出現 `icon` 亂碼的問題，可以在 `VS Code` 的 `settings.json` 把我們下載的字體補上：

```json
{
  "terminal.integrated.fontFamily": "'FiraCode Nerd Font'"
}
```

## History Autocomplete

順便記錄一下要怎麼讓我們的 `Windows Terminal` 支援 `History Autocomplete`

![Image](https://i.imgur.com/NCeuziX.png)

先安裝 `PSReadLine`

```
Install-Module PSReadLine -Force
```

確認是否安裝成功

![Image](https://i.imgur.com/4EsOGpj.png)

設定 History Autocomplete

```
Set-PSReadLineOption -PredictionSource History
```

之後將 `Windows Terminal` 關閉後重新開啟，並執行以下指令：

```
Set-PSReadLineOption -PredictionViewStyle ListView
```

現在應該會看到 Autocomplete 的呈現方式變成 List 了

![Image](https://i.imgur.com/b7TCyrq.png)

但現在重開 `Windows Terminal` 後，會發現 List 消失了。

所以執行

```
notepad $PROFILE
```

把以下這段貼到檔案中

```
Set-PSReadLineOption -PredictionViewStyle ListView
```

![Image](https://i.imgur.com/fQb3Jai.png)

## 參考資料

[oh-my-posh](https://ohmyposh.dev/)

[🎨 Make Windows Terminal Look Better | Oh My Posh Guide](https://www.youtube.com/watch?v=-G6GbXGo4wo)
