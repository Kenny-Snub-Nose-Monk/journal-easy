# Journal Easy 功能差異與移植結果

比較日期：2026-10-11。來源為本機乾淨的兩份 Git checkout：

- 舊版 `journal-easy`：`3e2b0f1`（2025-03-05）。
- 參考版 `journal-easy-web`：`ed992e7`（2026-09-02）。
- 修改版本：舊版 repo 的獨立 checkout `journal-easy-mvp`，分支 `feat/final-feature-parity-mvp`。

初次比較時 GitHub connector 對兩份 repo 回傳 404，本機 Git 無法解析 github.com。2026-10-11 使用者完成 GitHub 授權後，已透過 connector 確認兩份 repo 的預設分支皆為 main，遠端最新 commit 與上述本機版本完全一致，Git tree SHA 也相同。因此本報告的來源版本已與當次查詢的遠端預設分支核對，不需因遠端版本差異重做移植。兩份原始 checkout 與 sources 均未修改。

遠端來源：

- https://github.com/Kenny-Snub-Nose-Monk/journal-easy/commit/3e2b0f1856f77b8b0b79a9a9c86e1205d98f02c6
- https://github.com/Kenny-Snub-Nose-Monk/journal-easy-web/commit/ed992e76de481c28201872d976bdc44ea2d7b00a

## 實際功能比較

「已移植」代表程式、介面、API 與 schema 已移植並可編譯；不代表所有第三方／真實資料流程已驗證。

| 功能                                           | 舊版                        | 參考版                                | 本次結果                                                       |
| ---------------------------------------------- | --------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| 富文字、標題、表格、清單、圖片、欄位與斜線選單 | 已有                        | 持續擴充                              | 保留並沿用新版編輯器；私有圖片貼上套件改為公開 ProseMirror API |
| 文件新增、複製、移動、收藏、回收站、標題搜尋   | 已有                        | 加強資料驗證與目錄行為                | 沿用新版；補上來源複製與父資料夾權限檢查                       |
| 文件 Emoji 圖示                                | 無獨立 icon 欄位            | 有                                    | 已移植                                                         |
| 目錄拖曳排序與跨層移動                         | 無持久 sortOrder 與拖曳 API | 有，含子孫循環檢查及重排              | 已移植 `/api/doc/move`、拖曳介面與索引                         |
| 編輯器內搜尋／取代                             | 無                          | 有，含快捷鍵                          | 已移植                                                         |
| AI 翻譯、摘要、續寫、縮短、擴寫、語氣調整等    | 已有浮動 AI 選單            | 保留並擴充                            | 保留新版工具；改用伺服器代理                                   |
| AI 側欄對話                                    | 無獨立對話面板              | 有，可帶文件上下文及本機對話歷史      | 已移植；模型 endpoint 可設定，未設定時明確回報                 |
| Mermaid 圖表                                   | 無                          | 有，AI 內容預覽、插入、發布頁渲染     | 已移植；唯讀文件不允許修改 Mermaid 原始碼                      |
| 文件大綱、模板與工作區首頁                     | 舊版較簡單                  | 有新版組件                            | 已移植                                                         |
| 文件版本、內容差異與還原                       | 無 DocVersion 模型          | 有，包含切換文件／離頁快照            | 已移植；單人模式用 DB 交易備份與還原正文，不需協同服務         |
| 分享                                           | 文件連結＋密碼              | 指定使用者 READ／WRITE 權限與通知狀態 | 已移植，補讀寫及分享管理權限；單人預設不開放其他人登入         |
| 公開發布、更新、取消發布、按讚                 | 無                          | 有                                    | 已移植；本機圖片支援公開正文，網址使用本機 origin              |
| PDF 匯出                                       | 無                          | 有，依賴 CDN 腳本與 GCP 字型          | 改用瀏覽器列印另存 PDF；匯出方式與參考版不同                   |
| 管理後台                                       | 無                          | 文件／使用者列表、統計、發布凍結狀態  | 已移植；資料查詢先驗管理員權限，本機 owner 具管理員權限        |
| AI token 統計                                  | 有，由前端回報用量          | 改由伺服器讀 usage                    | 沿用並改為原子 SQL 更新，避免並行覆寫統計                      |
| 中文／英文、主題切換                           | 已有                        | 保留                                  | 保留                                                           |
| 即時協同與離線快取                             | 依賴 WebSocket／Yjs         | 依賴另外的 collab repo 與共用 DB      | 保留可選模式；預設改 HTTP 單人儲存、本機草稿與衝突檢查         |
| 手機工作區                                     | 明確不支援                  | 仍明確不支援                          | 保持桌面工作區，尚未完成手機版                                 |
| 系統監控、雲端部署                             | GCP 機密／儲存與相關設定    | Cloud Run／SQL、Sentry、SMTP 等       | 移除自動雲端部署設定、Sentry 與分析追蹤；liveness 不讀私人日記 |

證據主要位於 `src/app/api/`、`src/components/editor/`、`src/components/ai-panel/`、`src/components/doc-version/`、`src/app/admin/`、`prisma/schema.prisma`。目錄排序／版本／分享是資料模型的實際差異，不只是頁面外觀。

## 免費單人 MVP 決策

| 項目       | 預設選擇                                    | 原因與限制                                               |
| ---------- | ------------------------------------------- | -------------------------------------------------------- |
| 執行環境   | 自己電腦的 Next.js                          | 無平台帳單；只在電腦執行時可用                           |
| 資料庫     | 本機 PostgreSQL，可用 Docker Compose        | 無 Cloud SQL 依賴；需自行備份 volume                     |
| 圖片       | `data/uploads`，經權限檢查 API 提供         | 不需 GCS；搬機需一起複製圖片                             |
| 登入       | 環境設定密碼＋owner 帳號                    | 不需 OAuth 或寄信服務；可選 GitHub OAuth                 |
| AI         | 選用本機 Ollama／OpenAI-compatible endpoint | 不預設呼叫付費模型；效果與速度取決於硬體及模型           |
| 自動儲存   | 串行 HTTP PATCH＋本機草稿                   | 失敗保留重試，避免舊請求蓋掉新請求；多分頁衝突須重載處理 |
| 版本還原   | 交易中備份目前快照並寫回目標版本            | 單人模式不需要 collab restore API                        |
| PDF        | 系統列印另存 PDF                            | 無遠端 JS 與 46MB 字型下載；輸出跟瀏覽器列印設定有關     |
| 多人與雲端 | 可選設定，本次未啟用                        | 先滿足你一個人使用，不新增平台服務或帳單                 |

## 修正與刻意保留的差異

- 舊版的前端 OpenAI 金鑰、`dangerouslyAllowBrowser` 與回傳機密的 `/api/secret` 已移除。新版缺少權限的單篇文件讀取已補上 owner／share 驗證。
- 前端目錄排序原本經共用模組匯入 Prisma；已拆成純排序工具和 server-only 查詢，避免資料庫程式進入前端。
- 圖片上傳只接受 PNG/JPEG/GIF/WebP、5MB 以下；本機檔案路徑防止越界。私人圖片需權限；發布正文內的圖片可匿名讀取，撤下後恢復權限要求。
- 保留舊 `lastDocId`、InvitationCode.email 和 sharePassword 資料，但不再以舊密碼連結授權讀取日記。沒有自動推測舊分享對象。
- 新增本機密碼登入，與參考版的 GitHub／Email 登入不同；GitHub 和 SMTP 仍可選。
- 使用公開的編輯器 API 取代私有 Tiptap Pro drag handle／file handler。區塊操作列跟隨選取的區塊，互動位置與參考版的滑鼠懸浮控制不同。
- 移除學習／加入開發的舊宣傳入口、Sentry 和外部分析追蹤，以及部署到參考版 GCP 專案的工作流程。
- 語言選單、日期格式與介面用語統一為台灣繁體中文；清理舊示範資料與宣傳參照，AI 翻譯明確使用繁體中文。
- 無新增間隔複習、日文課程、錄音評分等功能：兩份來源專案沒有完整對應實作，本次也未另行擴張需求。

## 資料升級

`prisma/legacy-upgrade.sql` 是依兩份 schema 差異產生再調整的 PostgreSQL SQL。它有 BEGIN／COMMIT，避免半套 schema；正文 JSON 物件轉成 JSON 字串，若舊值本身是 JSON 字串則解除一層編碼；依同一 owner／父節點的建立時間補 sortOrder，每步 1024。

既有表與資料不做 DROP。新增 DocVersion、ShareRelation、PubDoc、必要 enum、索引及外鍵。新版 Prisma schema 保留原本的額外資料欄位。腳本預設只印 SQL，`--apply` 才執行。

此 SQL 尚未在真實 PostgreSQL 驗證。應先備份、停寫，並對副本執行後比較文件筆數、巢狀結構、中文內容及登入帳號，再決定替換原環境。

## 驗證結果與限制

使用者故事：登入 → 建立／選取日記 → 編輯器讀取 → 串行保存正文與標題 → 快照／還原 → 顯示內容。

已完成：

- `npm ci --offline --ignore-scripts`：利用既有套件快取安裝，已移除私有 registry 依賴。
- Prisma Client 生成：使用環境既有引擎完成；未對你的資料庫執行 schema 更新。
- Vitest：原有元件測試與新增 MVP 測試。最終數量見 `validation.md`。
- 新增整合測試用真實 Tiptap／Yjs 編輯器，HTTP 回應採 mock：確認不建立 WebSocket provider，能載入正文、產生正文／binary 快照、自動保存及保留標題草稿。
- TypeScript、ESLint、Next production build。細節見 `validation.md`。
- 舊版升級腳本 dry-run 可輸出 SQL，不改資料庫。

未完成：

- 此環境拒絕 `127.0.0.1:3067` 的 HTTP 監聽（`listen EPERM`），無法啟動網站進行瀏覽器操作與視覺驗收。
- Docker socket 存取亦被拒絕；沒有本機 PostgreSQL 執行環境，因此未驗證真實資料寫入、升級 SQL、完整密碼登入或真實版本還原。
- 未連接 Ollama／雲端 AI、SMTP、GCS 或協同服務。
- 本機驗證階段未執行 GitHub 推送、PR 或部署；GitHub 交付結果以後續分支／PR 紀錄為準，未部署網站。原始兩份 checkout 不受影響。

安全依賴限制：參考版鎖定 Next.js 14.1.4。此環境無法下載新的框架套件，保留鎖定版本以完成離線驗證。官方已有後續安全修補，這份交付只作本機 MVP；公開部署前必須升級到受支援且已修補版本並重驗。參考 https://nextjs.org/blog/security-update-2025-12-11 。

## 接手順序

1. 使用 README 的全新本機 DB 步驟，先完成登入、日記儲存、刷新、文件切換、排序、回收站、版本還原的人工驗收。
2. 對既有 DB 副本測試升級 SQL，確認數量及中文正文一致。
3. 設定本機 Ollama，驗收 AI 取消、重新產生、翻譯和多輪對話。
4. 有跨裝置需求時，再升級框架並評估雲端部署；不用先建立 GCP 或 Cloud SQL。
