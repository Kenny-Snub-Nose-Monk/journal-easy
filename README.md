# Journal Easy — 單人 MVP

以 `journal-easy` 為基底，移植 `journal-easy-web` 的新版功能。預設使用本機 PostgreSQL、檔案儲存與 HTTP 自動儲存，無需 GCP、私有 Tiptap registry 或協同編輯服務。

功能比較、修改範圍與驗證限制：[功能差異報告](docs/feature-parity.md)。

## 全新安裝

需要 Node.js 22、npm，以及 Docker（或自行啟動 PostgreSQL）。

```bash
npm ci
cp .env.example .env
```

設定 `.env`：

- `POSTGRES_PASSWORD` 與 `DATABASE_URL` 的密碼要一致；URL 中的特殊字元需編碼。
- `AUTH_SECRET`：使用 `openssl rand -hex 32` 產生。
- `LOCAL_PASSWORD`：設定登入密碼，可使用 `openssl rand -hex 24` 產生。
- `OWNER_EMAIL`：本機模式可保持 `owner@localhost`。

```bash
docker compose up -d db
npm run db:generate
npm run db:push
npm run dev
```

開啟 `http://localhost:3000`，以 `LOCAL_PASSWORD` 登入。登入後可建立日記、編輯、搜尋、收藏、管理版本與發布。資料存在 Docker 的 `journal-db` volume，圖片存在 `data/uploads`；瀏覽器草稿只是短期恢復用途，不是備份。

若已有自己的本機 PostgreSQL，直接設定 `DATABASE_URL`，不需執行 Docker。

## 舊版資料升級

既有資料庫請先匯出備份，並在資料庫副本上測試；不要直接對舊資料庫使用 `db:push`。應停止舊版與協同服務的寫入，再執行升級。

```bash
# 顯示 SQL，預設不改資料庫
npm run db:migrate:legacy

# 確認 DATABASE_URL 指向備份副本後才執行
npm run db:migrate:legacy -- --apply
npm run db:generate
```

SQL 以單一交易把 `Doc.content` 從 JSONB 轉為文字，補上目錄順序、版本、發布、分享和管理員欄位，保留 `User.lastDocId`、`InvitationCode.email` 與舊分享密碼。它針對原版 schema 設計，只執行一次；中途失敗會回滾。

舊密碼分享連結不再授權讀取私人文件，請改用新版的明確分享或公開發布。若原先沒有登入 Email 對應 `owner@localhost`，升級後請把 `OWNER_EMAIL` 設為原有帳號 Email，才能看到既有日記。

## AI（選用）

不設定 AI 時仍能使用寫作與文件功能。若要不使用雲端付費 API，可在本機執行 Ollama：

1. 啟動 Ollama，下載適合電腦記憶體的模型。
2. 用 `ollama list` 確認模型名稱。
3. 設定 `AI_BASE_URL=http://127.0.0.1:11434/v1`、`AI_MODEL=<已安裝的模型名稱>`，然後重啟應用。

支援 OpenAI-compatible endpoint，金鑰僅在伺服器使用。若改接雲端模型，費用由該供應商決定，應另外設定供應商預算；應用內的 token 記錄不是金額上限。

參考：[Ollama 相容 API](https://docs.ollama.com/api/openai-compatibility)、[AI SDK provider](https://ai-sdk.dev/providers/openai-compatible-providers)。

## 分享、協作與其他服務

預設只允許 `OWNER_EMAIL` 登入。本機密碼只對應該帳號。要讓其他人讀取分享日記，可明確加入 `ALLOWED_EMAILS` 並設定 GitHub OAuth；回呼是 `/api/auth/callback/github`。Email 登入只在設定 SMTP 後出現。

公開發布的文字與正文中的本機圖片可匿名讀取，取消發布後圖片重新需要文件權限。公開網址預設取目前網站 origin；若設定 `NEXT_PUBLIC_SITE_URL`，改動後需重新建置。

即時多人協作是選用模式，需要額外的協同服務、`NEXT_PUBLIC_COLLABORATE_EDIT_URL`、`COLLABORATE_EDIT_HTTP_URL` 和共享授權金鑰；此服務不包含在這兩份 Web repo 中，未在本次啟動。未設定 WebSocket URL 時以 HTTP 自動儲存，不會卡在協同連線畫面。

`STORAGE_DRIVER=gcs` 可選回 GCS；預設不使用。PDF 使用瀏覽器列印選擇「另存為 PDF」，不需從雲端下載字型。

## 驗證

```bash
npm run test-ci
npm run typecheck
npm run lint
npm run build
```

本次已完成程式測試和建置；真實資料庫升級、完整瀏覽器流程、AI 模型連線尚未完成驗證，詳見報告。

## 公開部署前

這次交付是本機 MVP，保留參考專案的 Next.js 14.1.4 鎖定依賴以完成離線驗證。該版本已有後續安全修補，**不可把目前版本直接公開上線**。需要網路可用後升級到受支援且已修補的 Next.js 版本、重新跑測試及建置，再選擇部署方案。

參考：[Next.js 官方安全修補公告](https://nextjs.org/blog/security-update-2025-12-11)。本次未建立或變更任何 GCP／部署平台服務。
