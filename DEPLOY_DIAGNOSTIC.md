# HeTu 深度診斷與環境重建 [cite: 2026-02-08, 2026-02-12]

## 1. 環境檢查結果

| 項目 | 狀態 | 說明 |
|------|------|------|
| Firebase CLI | ✅ 已安裝 | 版本 15.5.1 |
| 當前專案 | ✅ oilpluse-cb370 | `.firebaserc` 中 default 為 `oilpluse-cb370` |
| 登入權限 | ⚠️ 需重新驗證 | 終端顯示：`Your credentials are no longer valid. Please run firebase login --reauth` |

**請在本機執行：**
```bash
firebase login --reauth
```
完成後再執行 `firebase projects:list` 確認可列出 oilpluse-cb370。

---

## 2. 路徑強制校準

| 項目 | 結果 |
|------|------|
| 建置指令 | `cd client && npm run build`（Create React App） |
| 實際輸出目錄 | **client/build**（CRA 預設，並非 dist） |
| firebase.json `public` | 已為 `"client/build"`，與輸出一致 ✅ |
| 物理確認 index.html | 需在執行 `npm run build` 成功後，於 `client/build/index.html` 確認存在 |

若曾將 `public` 改為 `dist`，請改回 `client/build`，或確保根目錄有 `npm run build` 且輸出到 `dist` 後再將 `public` 設為 `dist`。目前專案僅 client 有 build，輸出為 **client/build**，故 **無需修改** firebase.json 的 public。

---

## 3. 底層重定向（rewrites）

firebase.json 已包含以下 rewrites，符合 HeTu 路由協議：

```json
"rewrites": [
  { "source": "/api/v1/conversion/report", "function": "conversionReport" },
  { "source": "**", "destination": "/index.html" }
]
```

- 所有未匹配路徑（`**`）均導向 `/index.html`，SPA 路由由前端接管。
- API 路徑 `/api/v1/conversion/report` 轉發至 Cloud Function。

---

## 4. 強制上架步驟（請依序在本機執行）

```bash
# 1. 重新登入 Firebase（若尚未執行）
firebase login --reauth

# 2. 安裝依賴並建置（產出 client/build）
cd /Users/yaokaikao/OilPulse-Genesis/client
npm install
npm run build

# 3. 物理確認 index.html 存在
ls -la build/index.html

# 4. 僅部署 Hosting
cd /Users/yaokaikao/OilPulse-Genesis
firebase deploy --only hosting
```

完成後請截取終端機**最後 10 行**結果。

---

## 5. 預期 deploy 成功時最後 10 行範例

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/oilpluse-cb370/overview
Hosting URL: https://oilpluse-cb370.web.app
```

（其餘行為各檔案 upload 進度，總行數依專案而異。）

## 6. 本次實際執行 deploy 之最後 10 行（未登入／未建置時）

```
Authentication Error: Your credentials are no longer valid. Please run firebase login --reauth
For CI servers and headless environments, generate a new token with firebase login:ci
Authentication Error: Your credentials are no longer valid. Please run firebase login --reauth
For CI servers and headless environments, generate a new token with firebase login:ci
Error: Assertion failed: resolving hosting target of a site with no site name or target name. This should have caused an error earlier
Error: An unexpected error has occurred.
```

表示需先完成 `firebase login --reauth`，且需存在 `client/build`（先執行 `npm run build`）再執行 deploy。
