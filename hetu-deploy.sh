#!/bin/bash
# HeTu 靈魂注入：重新授權 → 打包 → 部署 [cite: 2026-02-12]
set -e
cd "$(dirname "$0")"

echo "=== 步驟 1：請先在本機終端機執行 firebase login --reauth ==="
echo "    完成瀏覽器授權後，再執行此腳本或下方指令。"
echo ""

echo "=== 步驟 2：安裝依賴並打包 ==="
cd client
npm install
npm run build
cd ..

echo "=== 步驟 3：部署 Hosting ==="
firebase deploy --only hosting

echo ""
echo "若看到 ✔  Deploy complete! 代表 HeTu 系統已上線。"
