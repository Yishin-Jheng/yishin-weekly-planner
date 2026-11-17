---
name: css-to-tailwind
description: 將本專案指定 React 檔案的既有 CSS class 逐步轉成 Tailwind utility，保留外觀與行為，並清除不再使用的 CSS。用於樣式遷移及其檢查，不用於一般功能開發或重新設計。
---

# CSS 轉 Tailwind utility

## 範圍與專案約定

- 依使用者指定的檔案逐一轉換，不自行擴展到其他元件。
- 遵守專案 AGENTS.md 的修改授權規則；討論方案不代表授權修改。
- 保留現有外觀、互動與響應式行為，不順便調整版面、尺寸或重構元件。
- 共用樣式的抽象與優化留待遷移後處理；本階段不為了消除 utility 重複而抽共用元件、樣式常數或加入 @apply。
- 複雜選擇器與 keyframes 可以維持 CSS，不強求所有樣式都轉成 utility。

## 轉換前先確認

- 讀取目標檔案與相關樣式。目前全域入口為 src/index.css，Tailwind 由 vite.config.js 載入。
- 查清 class 的全部規則：基本樣式、狀態組合、偽類別、偽元素、後代選擇器及 media query。也留意父層或子元件對這些 class 的依賴。
- 用 rg 搜尋專案內的引用，包含動態拼接的 className 與以 class 為依據的其他程式碼；不要只搜尋完整的 className 字串。
- 查看現有 @theme、:root、reset 與 layer，避免只翻譯宣告而忽略實際的 cascade。

## Utility 的選擇

- 優先使用已有的語意 token，例如 bg-surface、border-border、text-text-muted，以當下 @theme 的定義為準。
- 優先採用語意與效果相同的簡短 utility。若既有 utility 引用同一個 CSS 變數，例如 `rounded-lg` 與 `rounded-[var(--radius-lg)]`，使用前者；沒有對應 utility 時，可使用變數簡寫，例如 `rounded-(--radius)`。採納 lint 建議前，確認產出的宣告與變數引用一致，不只比較目前的像素值；對應關係不明確時，再查定義或編譯結果。
- 尺寸能精確對應時使用標準 utility；否則可用 arbitrary value。不要為了採用預設級距而四捨五入原本尺寸。
- 保留斷點的數值與邊界語意。例如 max-width: 700px 包含 700px，可用 [@media(max-width:700px)]:… 精確表達，不直接換成不同的預設斷點。
- 動態狀態應在原條件下切換完整、可被 Tailwind 掃描的 utility 字串，不動態拼出 utility 名稱。
- 保持 hover、disabled、完成或選取狀態等原有互動條件，不藉此變更業務邏輯。
- 若 inline style 與 utility class 僅為寫法差異，且沒有特殊用途，可在指定檔案內一併遷移；須保留相同的樣式效果與條件邏輯。若 inline style 承載任意執行期數值，或刻意利用 inline 宣告的優先順序等特殊用途，則保留並說明原因。
- 未要求時，不順便修正原有版面問題；但有具體疑慮時皆可指出或提醒。

## Cascade 與保留的 CSS

- 本專案使用 Tailwind v4。一般宣告的既定 layer 順序為 theme → base → components → utilities；未分層的一般宣告優先於這些 layer，layer 的比較先於 specificity。
- 全域預設適合放在 base。目前 \* reset 已移入 @layer base；每次仍應讀取實際檔案，不假設其他規則也已分層。
- utility 被覆蓋時，先查 layer、specificity 與實際匹配的規則，不直接加 ! 或靠調整 className 順序解決。
- 若需改變全域 layer 或 reset，先評估並說明影響範圍，依當次授權處理；不要為單一元件默默調整全站優先順序。
- 共用 class 可以在指定檔案中改為 utility；其他元件若仍使用該 class，必須保留對應 CSS，且不順便修改那些元件。
- 保留的複雜 CSS 若依賴某個 class 作為選擇器掛鉤，保留該 class，或在本次範圍內同步調整依賴。修改完畢後，列出指定檔案中仍保留的原有 class，並簡述各自保留的原因。

## 清除舊樣式

- 轉換後再次搜尋引用，確認指定修改的檔案及專案其他地方都不再依賴該 class，才移除對應 CSS 規則。
- 一併檢查對應的 media query、狀態與後代選擇器；共用的選擇器列表只移除不再需要的部分，保留其他有效規則。
- 無法確定是否仍被使用的規則先保留，並說明原因。不順便清理與本次目標無關的 CSS 內容。

## 驗證與回報

- 檢查 diff，確認尺寸、狀態、斷點及其他元件使用的 CSS 均按原意保留。
- 執行 npm run build 與 git diff --check。特殊 utility 或 variant 有疑慮時，檢查產出的 CSS 是否符合預期。
- 有可用的瀏覽器驗證環境時，比對桌面、相關斷點與受影響狀態的外觀。
- 回報轉換範圍、移除或保留的 CSS 及驗證結果；建置通過不代表視覺確認，未做視覺比對時明確說明。
