# HETUYI Architecture Overview (Genesis 2.8)

## 系統指令存檔 (Project Identity & Directives)
- **專案負責人：** 高堯楷醫師 (Dr. Jacky Kao)
- **專案名稱：** 河圖易 (HetuYi)，基於 Genesis 2.8 架構。
- **核心美學：** 降維打擊（黑金極簡）。
- **核心架構：** Vue3 + Firebase + Cloudflare。
- **首頁：** `LandingPage.vue` 為神聖門面，不可隨意修改。
- **功能入口：** 功能頁面 (如 HomeView) 置於 `/apply`。
- **新 App 開發：** OilPulse、Sentinel 等須保持模組化，不得破壞現有路由與設計。

---

## Current Status (2026-02)
- **Phase 1 Complete:** Clinic OS (SaaS) deployed at `/apply`.
- **Phase 1 Complete:** Dimensional Portal deployed at `/`.
- **Infrastructure:** Firebase Hosting + Cloudflare (Full SSL/CDN).

## Roadmap
- [ ] **Phase 2:** Sentinel System (AI Prediction) -> `/research`
- [ ] **Phase 3:** OilPulse (Inventory/Newsletter) -> Independent Module

## Critical Rules
1. Never modify `LandingPage.vue` without direct authorization from Dr. Kao.
2. New apps (like Sentinel) must be developed in separate Views/Components, linked on the Landing gates.

## 第三道防線：平行宇宙開發法 (Git Branching)
防止「新功能搞壞舊系統」的物理隔離。**開發 Sentinel（哨兵系統）或任何新功能時，絕對不要在主線 (main) 上直接寫。**

### 習慣流程

**1. 切換到新宇宙（建立功能分支）**
```bash
git checkout -b feature/sentinel
```
此時創造了一個平行時空，在分支上開發、測試都不會影響 hetuyi.com 主線。

**2. 開發、測試、搞破壞**  
在 `feature/sentinel` 上自由改動，確認沒問題為止。

**3. 確認完美後，才合併回主宇宙**
```bash
git checkout main
git merge feature/sentinel
```
合併後可依團隊流程 push、部署。
