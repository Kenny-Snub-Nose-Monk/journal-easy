# 最終驗證（2026-10-11）

| 檢查                         | 結果         | 實際證據與範圍                                                                |
| ---------------------------- | ------------ | ----------------------------------------------------------------------------- |
| GitHub 遠端來源版本          | 通過         | 授權後確認兩份預設分支皆為 main；最新 commit 與 Git tree SHA 均與本機來源一致 |
| 套件安裝                     | 通過         | 本機快取安裝 1251 個套件；無 Tiptap Pro registry                              |
| Prisma Client 生成           | 通過         | v5.11.0；使用已存在的引擎，未修改任何資料庫                                   |
| Vitest                       | 通過         | 24 個測試檔，40 個測試，exit 0，無未處理錯誤                                  |
| TypeScript                   | 通過         | `tsc --noEmit`，exit 0                                                        |
| ESLint                       | 通過但有警告 | exit 0；7 個參考版既有 `<img>` 最佳化警告                                     |
| Production build             | 通過         | Next.js 14.1.4，Compiled successfully，完成路由及 build traces，exit 0        |
| 升級 SQL dry-run             | 通過         | 只輸出 SQL；未對任何 DB 執行                                                  |
| HTTP 服務／瀏覽器驗收        | 部分通過     | 已完成真實 HTTP 路由驗證；完整瀏覽器、登入與資料儲存仍待驗收                  |
| 真實 PostgreSQL 與資料遷移   | 未驗證       | Docker socket 存取被環境拒絕，沒有可用資料庫                                  |
| 真實 AI、Email、GCS、協同    | 未驗證       | 未設定或啟動相關服務                                                          |
| 本機驗證階段的推送、PR、部署 | 未執行       | 修改只在獨立 checkout／分支                                                   |

新增測試覆蓋搜尋結果鍵盤循環、輸入法組字、清單刷新與關閉後的事件清理，以及儲存合併與串行順序、失敗重試與新草稿保留、匿名存取阻擋、owner／分享權限、READ／WRITE 權限、過期保存衝突、正文／binary 同步保存、交易式版本備份與還原，以及真實 Tiptap 編輯器的 HTTP 模式及標題草稿。API、DB 呼叫以 mocks 驗證，並非真實服務的端到端驗收。

首次建置曾因離線 Prisma 引擎未複製而出現初始化錯誤；已補上本機既有引擎並重建，最終建置沒有該錯誤。新整合測試另修正了測試 runner 混用搜尋套件 CJS／ESM 入口造成的 DecorationSet 類別不一致。

公開部署前需更新參考專案的舊 Next.js 依賴並重新驗證；本次結果只支持本機 MVP 交付。完整差異與限制見 feature-parity.md。

介面在地化與內容清理：已掃描 src、messages、public、文件與套件清單中的舊外部服務、宣傳參照、地區標記和示範資料；清理後沒有殘留匹配。語言選單使用語言名稱，AI 翻譯指定繁體中文（台灣），管理介面使用 zh-TW 日期格式。已移除 ahooks 依賴，改用原生 React 鍵盤監聽與既有 debounce 工具。

## 本機首頁重新導向修正（2026-10-11）

重現：Next.js 14.1.4 綁定 127.0.0.1 時，next-intl 的 localhost 語系內部改寫被當作代理請求，首頁反覆回傳 307 並導向自己。將 dev 與 start 指令統一綁定 localhost。

同一份 production build 的實際 HTTP 對照：原主機設定會超過 curl 的重新導向次數上限；修正後 `/`、`/en`、`/signin` 都回傳 200，`/zh-tw` 只重新導向一次至預設語系首頁。開發模式也確認 `/` 回傳 200、零次重新導向。Production build 重新通過。

測試使用隔離的 3001 埠與測試用 AUTH_SECRET，不改既有 3000 埠程序或資料庫。開發模式測試使用 WATCHPACK_POLLING=true 以避開此環境的檔案監聽數量限制。這是 HTTP 路由驗證，不代表完整登入、資料庫或瀏覽器流程通過。
