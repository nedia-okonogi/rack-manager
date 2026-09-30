# DataCenter Rack Manager v0.6.1 (FastAPI + SQLite + VLAN & Port IP Manager)

データセンター・サーバールーム向け ラック構成管理 ＆ 変更履歴双方向同期システム **Version 0.6.1**

## 🌟 Version 0.6.1 改善点
- **ラック内機器表示のレイアウト最適化**:
  - ホスト名（`device-hostname`）とIPアドレス（`device-ip` / `VIP`）の表示順を入れ替え、ホスト名を先頭に配置。
  - VIP登録時にもホスト名を先頭にし、続いてVIP・Mgmt IPを表示。
  - 機器情報部（`.device-main-info` / `.device-primary-row`）の `flex-wrap: wrap` に対応。
- **データ管理の完全サーバーDB一本化**:
  - 業務データはサーバーDB（SQLite）のみで管理し、`localStorage` はテーマ設定等の個人環境設定のみに限定。

## 🚀 起動方法

### Windows
`start.bat` をダブルクリックするだけで、必要なパッケージの確認とサーバー起動が自動実行されます (Port 8005)。

またはコマンドプロンプト / PowerShell から:
```powershell
cd d:\01.workspace\rack-manager-v0.6.1
python -m pip install -r requirements.txt
python server.py 8005
```

### Linux / macOS
```bash
cd /path/to/rack-manager-v0.6.1
chmod +x start.sh
./start.sh
```

ブラウザで以下のURLを開きます:
- **Web UI アプリケーション**: [http://localhost:8005/](http://localhost:8005/)
- **FastAPI インタラクティブAPI仕様書**: [http://localhost:8005/docs](http://localhost:8005/docs)

---

## 📖 使い方マニュアル
詳細な利用手順や画面操作、各機能の使い方については [USER_MANUAL.md](file:///d:/01.workspace/rack-manager-v0.6.1/USER_MANUAL.md) をご覧ください。

---

## 📂 ディレクトリ構成

```
rack-manager-v0.6.1/
├── server.py              # FastAPI メインアプリケーション (REST API + 静的配信 + Ping)
├── database.py            # SQLite テーブル定義・マイグレーション・CRUD処理
├── rack_manager.db        # SQLite データベース実体 (初回起動時に自動生成)
├── requirements.txt       # fastapi, uvicorn, pydantic
├── start.bat              # Windows用ワンクリック起動スクリプト
├── start.sh               # Linux/macOS用起動スクリプト
├── index.html             # SPA メインマークアップ (SVGアイコン, 申請書, 変更履歴)
├── styles.css             # CSS デザインシステム (ダークテーマ, CSS Grid, A4印刷用スタイル)
├── app.js                 # フロントエンドSPA制御ロジック
├── data.json              # 初回起動時シードデータ
├── USER_MANUAL.md         # システム利用・操作マニュアル
└── README.md              # 概要ドキュメント
```

