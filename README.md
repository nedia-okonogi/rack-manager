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

### Linux / macOS (手動起動)
```bash
cd /path/to/rack-manager-v0.6.1
chmod +x start.sh
./start.sh
```

### 🐧 Linux (systemd による自動起動・常駐サービス化)
本番環境や常時稼働サーバーでは、`systemd` サービスとして登録することで、OS起動時の自動立ち上げや異常終了時の自動再起動が可能になります。

#### 1. ユニットファイルを作成
`/etc/systemd/system/rack-manager.service` を作成します。

```ini
[Unit]
Description=DataCenter Rack Manager FastAPI Server
After=network.target

[Service]
WorkingDirectory=/srv/rack-manager-v0.6.1

ExecStart=/usr/bin/python3 /srv/rack-manager-v0.6.1/server.py 50081

Restart=always
RestartSec=5

Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
```

#### 2. サービスを有効化＆起動
```bash
# systemd の設定をリロード
sudo systemctl daemon-reload

# 自動起動を有効化して即時起動
sudo systemctl enable --now rack-manager

# 稼働ステータス確認
sudo systemctl status rack-manager
```

#### 3. ログの確認・停止・再起動
```bash
# リアルタイムログ確認
sudo journalctl -u rack-manager -f

# 再起動
sudo systemctl restart rack-manager

# 停止
sudo systemctl stop rack-manager
```

---

ブラウザで以下のURLを開きます（※ポートは指定したもの、systemd例では `50081`）:
- **Web UI アプリケーション**: [http://localhost:50081/](http://localhost:50081/) (手動デフォルトは `8005`)
- **FastAPI インタラクティブAPI仕様書**: [http://localhost:50081/docs](http://localhost:50081/docs)

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

