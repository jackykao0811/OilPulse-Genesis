{ pkgs, ... }: {
  # 使用穩定版頻道以加速套件下載
  channel = "stable-23.11";

  # 僅保留核心開發工具，減少 iPad 內存負擔
  packages = [
    pkgs.nodejs_20
    pkgs.firebase-tools
    pkgs.git
  ];

  idx = {
    # 只載入絕對必要的擴充套件，避免 iPad 瀏覽器卡頓
    extensions = [
      "Firebase.firebase-vscode"
      "esbenp.prettier-vscode"
      "bradlc.vscode-tailwindcss"
    ];

    workspace = {
      # 【關鍵優化 1】將繁重任務移至 onCreate
      # 這只會在專案建立或大幅更動時執行一次
      onCreate = {
        npm-install = "npm install";
      };

      # 【關鍵優化 2】onStart 僅執行輕量級指令
      # 確保 iPad 喚醒環境時能在 10 秒內完成
      onStart = {
        # 自動啟動開發伺服器，方便 iPad 即時預覽
        watch-backend = "cd functions && npm run build -- --watch";
      };
    };

    # 優化預覽視窗，自動適應 iPad 螢幕比例
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
