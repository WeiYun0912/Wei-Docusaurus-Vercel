---
title: "前端面試考題"

keywords: [html, css, js, react]

description: 前端面試考題

author: WeiYun0912

og:title: 前端面試考題

og:description: 前端面試考題
---

import TextAlignJustify from "@site/src/components/mdHelper/TextAlignJustify";
import CenterImage from "@site/src/components/mdHelper/CenterImage";

## 說明

統整常出現的前端面試題目，尚未分類，持續更新中…

### 解釋 DOM

<TextAlignJustify>
DOM（文件物件模型 Document Object Model）是一個跨平台和語言獨立的介面，讓程式能夠讀取和更新文件的內容、結構以及樣式。DOM 將 HTML、XML 或 SVG 文件表示為節點和物件的樹狀結構，讓開發者可以用 JavaScript 操作這些節點，進行新增、移除或修改頁面的元素和內容。
</TextAlignJustify>

### CSS Box Model 包含哪些元素

<TextAlignJustify>
CSS 箱子模型由四個部分組成：內容（Content）、內邊距（Padding）、邊框（Border）和外邊距（Margin）。內容區域存放實際的內容，內邊距圍繞著內容區域，邊框圍繞著內邊距，最外層的外邊距則是盒子和其他元素之間的空白區域。

</TextAlignJustify>

![Image](https://i.imgur.com/k0JVwK2.png)

### 請解釋 CSS 預處理器及其優點

<TextAlignJustify>
CSS 預處理器，如 Sass / SCSS、LESS 或 Stylus，是一種腳本語言，允許開發者使用變數、函式、混合（mixins）和其他高級功能來寫 CSS，這些腳本在處理過程中被編譯成標準的 CSS 檔案。預處理器的使用可以提高 CSS 的維護性、可讀性和重用性，並可以加快開發流程。
</TextAlignJustify>

<CenterImage src="https://i.imgur.com/cnBx2Fu.png"/>

### 請解釋 const、let 和 var 的作用域差異。

<TextAlignJustify>
const 和 let 是塊級作用域（block scope），意味著它們定義的變數只在包含它們的塊或 for 循環內有效。而 var 則是函式作用域（function scope）或全局作用域（global scope），在函式內部使用 var 聲明變數時，該變數屬於函式作用域；如果在函式外部使用，則該變數屬於全局作用域。
</TextAlignJustify>

### const、let 和 var 在同一作用域下宣告同名變數的行為有何不同

<TextAlignJustify>
在相同作用域下，const和let不允許重複宣告相同名稱的變數；嘗試這樣做會導致語法錯誤。相反地，var允許在同一作用域內重複宣告同名變數，如果不在嚴格模式（strict mode）下，var甚至允許未經宣告就賦值使用，這可能會導致預期之外的行為和錯誤。
</TextAlignJustify>

### 請解釋 const、let 和 var 在 Hoisting（變數提升）方面的行為。

<TextAlignJustify>
var 宣告的變數會發生變數提升，意味著在代碼執行之前，變數已經被提升到其作用域的頂部，但是變數的賦值操作不會提升。而 const 和 let 宣告的變數不會被提升，如果在聲明之前讀取它們，會導致一個參考錯誤（ReferenceError）。
</TextAlignJustify>

### var、const 和 let 是在 JavaScript 的哪個版本中引入的？

<TextAlignJustify>
var 是 JavaScript 誕生時就存在的變數宣告關鍵字，而 const 和 let 則是在 ECMAScript 6（ES6/ES2015）中引入的，作為新增的變數宣告方式，以提供更好的作用域控制和減少變數提升導致的錯誤。
</TextAlignJustify>

### 請解釋在 JavaScript 中，函式聲明（Function Declaration）和函式表達式（Function Expression）在變數提升（Hoisting）方面的行為有何不同？

<TextAlignJustify>
在 JavaScript 中，函式聲明會被完全提升，允許你在聲明之前調用函式。而函式表達式的提升取決於宣告方式：使用 var 宣告的函式表達式，變數名被提升但函式本身不會，導致提前調用時變數為 undefined；若用let 或 const，則變數名和函數都不提升，提前調用會報錯。
</TextAlignJustify>

### 解釋 == 和 === 的不同。

<TextAlignJustify>
在 JavaScript 中，== 是等值比較運算符，它在比較之前會進行類型轉換，如果兩個操作數類型不同，JavaScript 會嘗試將它們轉換成相同類型再進行比較。相反，=== 是嚴格等值比較運算符，不會進行類型轉換，如果兩個操作數的類型不同，直接返回 false。
</TextAlignJustify>

### 解釋 Cookie、Local Storage、Session Storage 的差別。

<TextAlignJustify>
Cookie 用於存儲小量資料，隨 HTTP 請求發送，有大小和時間限制。LocalStorage 提供長期儲存，不隨請求發送，容量較大。SessionStorage 類似 LocalStorage，但資料僅在工作階段（Session）期間有效，關閉標籤頁後清除。
</TextAlignJustify>

| 特性         | Cookie                                                     | LocalStorage       | SessionStorage                         |
| ------------ | ---------------------------------------------------------- | ------------------ | -------------------------------------- |
| 設定方式     | 1. 伺服器通過 HTTP Response Header 設定<br />2. JavaScript | JavaScript         | JavaScript                             |
| 資料大小限制 | 約 4KB                                                     | 約 5MB             | 約 5MB                                 |
| 資料生命周期 | 可設定過期時間，過期後自動刪除                             | 沒有時間限制       | 瀏覽器標籤頁打開期間，關閉後刪除       |
| 資料共享     | 每次 HTTP 請求都會附帶，影響效能                           | 不隨 HTTP 請求發送 | 不隨 HTTP 請求發送，不同標籤頁間不共享 |
| 主要用途     | 需自動夾帶在 HTTP 請求中的狀態，通常拿來辨認使用者         | 需長期儲存的狀態   | 儲存工作階段間的一次性狀態，如操作資料 |

### 請解釋 JavaScript 的閉包（Closure）是什麼？

<TextAlignJustify>
閉包是 JavaScript 的一個重要概念，指的是一個函式和其周圍的狀態（詞法環境）的組合。在 JavaScript 中，當一個函式返回另一個函式時，該返回的函式會保留對原函式範疇中變數的引用。這使得即使外部函式已經執行完畢，內部函式仍然可以訪問外部函式的變數。
</TextAlignJustify>

### 什麼是執行上下文（Execution Context）在 JavaScript 中的意義？

<TextAlignJustify>
 在 JavaScript 中，執行上下文是一個抽象的概念，它表示當前程式碼的執行環境。每當函式被呼叫時，就會創建一個新的執行上下文，這個上下文包含了函式的參數、局部變數和這個函式能夠訪問的其他資料。
</TextAlignJustify>

### 請解釋 JavaScript 中的事件冒泡和事件捕獲。

<TextAlignJustify>
事件冒泡（Event Bubbling）和事件捕獲（Event Capturing）是 DOM 事件傳播的兩個階段。事件捕獲階段從最外層的元素開始接收事件，然後逐級向下傳播到事件的目標元素；事件冒泡階段則是事件從目標元素開始，然後逐級向上傳播到最外層的元素。預設情況下，事件處理器是在冒泡階段被執行的，但可以通過新增事件監聽器時設定使用捕獲階段。
</TextAlignJustify>

<CenterImage src="https://i.imgur.com/G4gxguP.png"/>

### 請解釋事件委派是什麼以及它的好處。

<TextAlignJustify>
事件委派（Event Delegation）是一種 JavaScript 事件處理方法，它利用了事件冒泡的原理，將事件監聽器新增到一個父元素上，而不是將事件監聽器新增到多個子元素上。這樣當子元素上的事件被觸發並冒泡到父元素時，可以在父元素上處理這些事件。事件委派的好處包括減少記憶體使用、避免為每個子元素新增事件監聽器，以及動態元素的事件處理。
</TextAlignJustify>

### 請解釋 JavaScript 的原型繼承是如何工作的。

<TextAlignJustify>
JavaScript 的繼承（Inherit）是基於原型（Prototype）的。每個 JavaScript 物件都有一個指向另一個物件的原型屬性，這個指向的物件就是其原型。當試圖訪問一個物件的屬性或方法時，如果該物件本身沒有這個屬性或方法，JavaScript 會繼續在這個物件的原型鏈上尋找，直到找到或達到原型鏈的末端。
</TextAlignJustify>

<CenterImage src="https://i.imgur.com/kRNLX5q.png"/>

### 什麼是 JavaScript 的非同步程式設計，並提供一個例子？

<TextAlignJustify>
非同步程式設計是指允許程式在等待某個長時間運行的任務（例如，I/O 操作如網絡請求或檔案讀寫）完成時，繼續執行其他任務的程式設計方式。JavaScript 中實現非同步程式設計的方法有多種，包括回調函式、Promises 和 async/await。例如，使用Promise進行網絡請求：
</TextAlignJustify>

```js showLineNumbers
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

### 請解釋什麼是事件循環，以及它是如何工作的？

<TextAlignJustify>
事件循環（Event Loop）是 JavaScript 的一個工作機制，用於在單執行緒（Single Thread）環境中處理非同步事件。JavaScript 引擎使用事件循環來協調事件、用戶互動、腳本、渲染、網絡請求等的執行。事件循環的核心是一個不斷檢查消息佇列（Message Queue）是否有待處理消息的過程，如果有，就取出一個消息並執行相應的回調，直到消息佇列清空。
</TextAlignJustify>

![Image](https://i.imgur.com/waUZ0sl.png)

<CenterImage src="https://i.imgur.com/DxOmAWu.png"/>

### 請解釋 JavaScript 中的 this 關鍵字如何工作。

<TextAlignJustify>
在JavaScript中，this關鍵字指的是函式當前的執行上下文。它的值取決於函式是如何被呼叫的，而不是如何被定義的。在全域範圍內，this指向全域物件；在方法內部，this指向呼叫該方法的物件；在事件處理函式中，this通常指向觸發事件的元素；在箭頭函式中，this被設定為它被創建時的上下文。
</TextAlignJustify>

### 解釋什麼是模組化 JavaScript，以及它的好處。

<TextAlignJustify>
模組化 JavaScript 是一種將 JavaScript 程式碼分割成可重用模組的程式設計方法。每個模組都有自己的範疇，僅暴露出必要的公共介面（Public Interface）供其他模組使用，而隱藏其內部實現細節。這種方法的好處包括提高程式碼的可維護性、可重用性和可測試性，以及更容易管理依賴關係。使用如 ES Module 或 CommonJS，開發者可以將程式碼組織得更加清晰和模組化。
</TextAlignJustify>

![Image](https://i.imgur.com/bBTIpOE.png)

### 解釋單頁式應用（SPA）和多頁式應用（MPA）的區別。

<TextAlignJustify>
單頁式應用（Single Page Application，簡稱 SPA）是一種網頁應用模型，只有一個主要的 HTML 頁面，利用 JavaScript 動態更新內容，用戶與應用互動時不需要重新載入頁面。多頁應用（MPA）則是傳統的網頁應用模型，每次用戶請求新的頁面或資料時，伺服器都會返回一個新的 HTML 頁面，這導致頁面的完全重新載入。
</TextAlignJustify>

![Image](https://i.imgur.com/GZVUrKA.png)

![Image](https://i.imgur.com/Qdhnpfn.png)

### 解釋前端路由和它在單頁應用中的作用。

<TextAlignJustify>
前端路由是一種在客戶端管理路徑（Path）和視圖（View）的技術，而不是通過伺服器重新載入頁面。在單頁應用（SPA）中，前端路由使得用戶可以在不同的視圖間導航而無需頁面重新載入，從而提供更快的用戶體驗。這是通過改變 URL 並同時不讓瀏覽器向伺服器發送請求來實現的。
</TextAlignJustify>

### 什麼是虛擬 DOM？ (vdom)

<TextAlignJustify>
虛擬DOM（Virtual DOM）是一種程式設計概念，其中UI的理想或虛擬表示形式保留在記憶體中，並通過與實際 DOM 的最小化差異同步，這有助於提高應用的性能和回應速度。這種方法允許開發者以一種更聲明式的方式來處理UI的變化，而不需要直接操作DOM。
</TextAlignJustify>

![Image](https://i.imgur.com/5QU3kBo.png)

### 請解釋什麼是 AJAX，以及它如何工作？

<TextAlignJustify>
AJAX（Asynchronous JavaScript and XML）是一種在無需重新載入整個頁面的情況下，能夠與伺服器交換資料並更新部分網頁的技術。它通過 JavaScript 發送非同步請求（XMLHttpRequest 簡稱 XHR，或 Fetch）到伺服器，伺服器回應請求後，JavaScript 再根據回應更新頁面的特定部分。這使得應用能夠更快回應用戶操作。
</TextAlignJustify>

### 解釋什麼是跨域資源共享（CORS），以及它為何重要？

<TextAlignJustify>
跨域資源共享（CORS）是一種機制，它允許限制資源（如字型、JavaScript 等）在網頁應用中被請求自不同的域，這是出於安全原因。CORS 通過伺服器設置特定的 HTTP 回應頭（Response Header）來實現，這些頭資訊告訴瀏覽器允許來自特定來源的請求訪問該資源。CORS 對於建立一個安全的網際網路生態系統至關重要。
</TextAlignJustify>

### 解釋什麼是跨網站腳本攻擊（XSS），以及如何防範它？

<TextAlignJustify>
跨網站腳本攻擊（XSS）是一種安全漏洞，攻擊者通過在網頁中注入惡意腳本，當其他用戶瀏覽這些網頁時，執行這些腳本，從而獲取用戶資料或其他敏感資訊。防範XSS的方法包括對用戶輸入進行驗證和轉義、使用CSP（內容安全政策）來限制資源的來源，以及使用 HTTPOnly 標誌來保護 cookie 等。
</TextAlignJustify>

### 請解釋什麼是 Progressive Web Apps（PWA），以及它們的主要特點是什麼？

<TextAlignJustify>
 Progressive Web Apps（PWA）是一種使用現代 Web 技術建立的應用，旨在提供類似於原生應用（Native Apps）的用戶體驗。它們的主要特點包括：可靠性（即使在不穩定的網絡條件下也能立即載入）、快速回應（快速回應用戶的互動）、和可安裝（允許用戶將Web應用新增到主螢幕，無需通過應用商店）。
</TextAlignJustify>

### 解釋前端性能優化的常見方法有哪些？

前端性能優化的常見方法包括：

- 減少 HTTP 請求：通過合併檔案、使用精靈圖（Sprite Map）等方法。
- 優化資源：壓縮 CSS、JavaScript 檔案，優化圖片尺寸及檔案格式。
- 使用 CDN 分發靜態資源。
- 延遲載入非關鍵資源，如靜態資源（圖片），或將 JavaScript 進行程式碼分割（Code Splitting），再按需載入。
- 利用瀏覽器快取，通過設置合理的 Cache-Control Header。
- 使用 Service Workers 進行資源的預載入和快取。
- 避免不必要的重排（re-flow）和重繪（re-paint），合理使用 CSS 和 DOM。
- 防抖和節流

### 瀏覽器是如何渲染畫面的？

1. 解析 HTML：瀏覽器將 HTML 文檔解析成 DOM（文件物件模型）樹。
2. 解析 CSS：解析 CSS 檔案和 `<style>` 標籤中的樣式，生成 CSSOM（CSS 物件模型）樹。
3. DOM 樹與 CSSOM 樹結合：將 DOM 樹和 CSSOM 樹結合生成渲染樹（Render Tree），渲染樹只包含需要顯示的節點及其樣式資訊。
4. 佈局（Layout/Reflow）：計算渲染樹中每個節點的位置和大小。
5. 繪製（Paint）：根據渲染樹以及佈局資訊，將元素繪製到屏幕上。
6. 合成（Composite）：如果頁面中有多層疊加的元素（如透明度、陰影等），瀏覽器會在繪製後進行合成。

### JavaScript 的 new 做了什麼？

使用 new 運算符創建一個實例對象時，會進行以下步驟：

1. 創建一個空物件。
2. 將這個空物件的原型（proto）指向其構造函數的 prototype 物件。
3. 將這個新物件作為 this 上下文調用構造函數，以初始化新物件。
4. 如果構造函數返回一個物件，則返回這個物件；否則，返回創建的新物件。

### 在 React 和 Vue 中，key 做了什麼，有什麼好處，如果不寫會怎樣？

在 React 和 Vue 中，key 是用來追蹤每個元素的唯一性的。使用 key 可以提高渲染效率：

- 好處：
  - 提高重新渲染的效率，當數據變化時，可以通過 key 快速確定哪些元素被新增或刪除，從而只更新變化的部分，而不是重新渲染整個 list。
  - 幫助避免一些與狀態管理相關的錯誤，特別是在使用可變數據或復雜元件結構時。
  - 如果用在單一元件上，當 key 改變時，可以重置元件的狀態。
- 如果不寫：
  - 如果不提供 key 或者 key 不唯一，可能會導致渲染錯誤，效能下降，或者在使用元件狀態時出現難以追蹤的錯誤。

### package 的 lock file 做什麼用？

<TextAlignJustify>
package-lock.json（npm）或 yarn.lock（Yarn）記錄了安裝的每個依賴的確切版本，以確保項目在不同環境中安裝相同版本的依賴，從而避免了因依賴版本差異帶來的問題。

當下 npm ci 時，是照 package-lock.json 下載依賴的，確保 CI 時的依賴不會跑掉，不同於 npm install 是照 package.json 下載依賴，有可能導致依賴不同的 runtime error。
</TextAlignJustify>

### CommonJS 和 ESModule 有什麼差別？

- CommonJS：
  - 用於 Node.js，採用 require 來載入模組，module.exports 或 exports 來輸出模組。
  - 模組是同步載入的。
  - 執行時載入，意味著導入的值是一個物件的 copy，不會隨著導出方的變化而變化。
- ESModule：
  - ECMAScript 標準的模組系統，採用 import 和 export 語句。
  - 支援非同步。
  - 靜態載入，意味著載入的是一個“活”連接，如果輸出值變化，載入值也會跟著變。

### XHR 和 Fetch 有什麼差別？

- XHR（XMLHttpRequest）：
  - 較舊的 API，需要較多的程式碼來處理請求和響應。
  - 支持同步和非同步請求。
  - 不支援 Promises，錯誤處理較為複雜。
- Fetch API：
  - 現代的替代 XHR 的 API，使用 Promises，使得非同步處理更加簡潔。
  - 不支援取消請求（直到 Fetch API 的 AbortController 出現）和進度監控。
  - 更簡潔的 API，易於使用和學習。

### 如果整個網頁都不使用一般的 HTTP 請求，而是全部採用 WebSocket，會有什麼缺點？

- 效能問題：WebSocket 需要保持持久連接，這可能會增加伺服器的資源消耗。
- 複雜性：對於簡單的請求-響應模式，WebSocket 的實現可能過於複雜。
- 兼容性和支持：雖然現代瀏覽器普遍支持 WebSocket，但在某些舊瀏覽器或網路環境中可能存在兼容性問題。
- 安全性：需要實施額外的安全措施，如使用 WSS（WebSocket Secure）。

### HTTP/1.1 和 HTTP/2.0 有什麼差別？

- HTTP/1.1：
  - 每個 TCP 連接只能處理一個請求/響應。
  - 支援持久連接（Connection: keep-alive）來減少連接開銷。
  - 面臨隊頭阻塞問題。
- HTTP/2.0：
  - 支持多路復用，一個連接可以同時處理多個請求/響應。
  - 引入了伺服器推播功能。
  - 使用了二進制分幀層來改進性能和安全性。
  - 更有效的頭部壓縮機制（HPACK）減少開銷。

## 資料來源

[新手導向前端學習讀書會群組(狐狸大) - 面試考題筆記](https://purple-sapphire-344.notion.site/d18f5b9ec4e64182ba0288ed37de914b)
