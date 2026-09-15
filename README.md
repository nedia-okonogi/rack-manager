# DataCenter Rack Manager v0.6.1

データセンター・サーバールーム向け ラック構成管理 ＆ 設備台帳・変更履歴双方向同期システム  
（FastAPI + SQLite WAL + Single Page Application）

---

## 🌟 主な機能・特徴

- 🖥️ **直感的なラックマウント管理**:
  - ドラッグ＆ドロップによる機器の配置・移動・撤去。
  - 前面（Front）/ 背面（Rear）/ 前後貫通、ハーフ幅スロット（左列・右列）対応。
- 🔌 **L3 / VLAN ＆ ポート別IP・配線管理**:
  - 各機器のポート別 IP / VLAN / Subnet の設定・タグ管理。
  - ラック内外の機器間ケーブル配線、および Floor（島ハブ・フロア情報コンセント）への外部配線管理。
- 📋 **機器管理台帳 ＆ 変更履歴同期**:
  - 機器ごとの管理番号（`CHG-2026-xxx`）の自動採番と一意性保証。
  - 機器の追加・移設・設定変更・撤去を自動記録。
  - **追加申請書・変更申請書・破棄申請書**の自動生成＆A4印刷対応。
- 🏢 **その他の場所（Other Locations）＆ 機器保管庫**:
  - ラック外の機器（PC、拠点機器、予備機）の9項目台帳管理（設置日時、管理番号、メーカー、型番、デバイス名、IP、設置場所、Office、備考）。
  - 一時退避機器をストックする機器保管庫ウィジェット。
- ⚡ **死活監視（Ping）＆ 障害影響分析**:
  - バックエンドからの非同期 ICMP Ping 監視とリアルタイム稼働ステータス表示。
  - 機器やポート障害時の接続先波及影響分析（Impact Analysis）。
- 🎨 **マルチテーマ ＆ レスポンシブUI**:
  - Dark、Material Light、Pastel、Matrix、Monokai、Dracula、Cappuccino テーマ。
  - 画面幅に応じたスマートなヘッダーレスポンシブ最適化。

---

## 📂 ディレクトリ構成

```
rack-manager/
├── server.py              # FastAPI バックエンド (REST API + 静的配信 + Ping死活監視)
├── database.py            # SQLite DB層 (WALモード、自動マイグレーション、初期シード内蔵)
├── app.js                 # フロントエンドSPA制御ロジック
├── index.html             # メイン画面HTML (各種モーダル・申請書テンプレート内蔵)
├── styles.css             # デザインシステム (テーマ、CSS Grid、A4印刷スタイル)
├── requirements.txt       # Python依存パッケージ (fastapi, uvicorn)
└── README.md              # 本ドキュメント
```

> **Note**: データベース実体（`rack_manager.db`）は初回起動時に自動生成され、内蔵シードにより自動セットアップされます。

---

## 🚀 インストール ＆ 起動手順 (Linux)

### 1. 必要要件
- Linux OS (Ubuntu, Debian, RHEL, Rocky Linux, CentOS等)
- Python 3.9 以上
- pip

### 2. 依存パッケージのインストール
```bash
# プロジェクトディレクトリへ移動
cd /path/to/rack-manager

# 必要なライブラリをインストール
pip install -r requirements.txt
```

### 3. 手動起動による動作確認
ポート `50081`（任意のポート番号）で起動します:
```bash
python3 server.py 50081
```

ブラウザで以下のURLにアクセスして動作を確認します:
- **Web UI**: `http://<サーバーのIPアドレス>:50081/`
- **API ドキュメント (Swagger)**: `http://<サーバーのIPアドレス>:50081/docs`

---

## ⚙️ systemd による常駐サービス化（自動起動・復旧設定）

サーバー再起動時の自動起動や、プロセスクラッシュ時の自動復旧を行わせるため、`systemd` に登録します。

### 1. サービス定義ファイルの作成
`/etc/systemd/system/rack-manager.service` を作成します:

```bash
sudo nano /etc/systemd/system/rack-manager.service
```

以下の内容を記述します（※ `User`, `Group`, パスは環境に合わせて書き換えてください）:

```ini
[Unit]
Description=DataCenter Rack Manager Service
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/path/to/rack-manager
ExecStart=/usr/bin/python3 /path/to/rack-manager/server.py 50081
Restart=always
RestartSec=5
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
```

### 2. サービスの有効化と起動
```bash
# systemd の設定を再読み込み
sudo systemctl daemon-reload

# OS起動時の自動起動を有効化
sudo systemctl enable rack-manager

# サービスを開始
sudo systemctl start rack-manager
```

### 3. ステータス確認とログ管理
```bash
# 稼働状況の確認
sudo systemctl status rack-manager

# リアルタイムログの閲覧
sudo journalctl -u rack-manager -f

# サービスの停止 / 再起動
sudo systemctl stop rack-manager
sudo systemctl restart rack-manager
```

---

## 🔒 セキュリティと運用上の注意

- **データ永続化**: 業務データはすべて SQLite (`rack_manager.db`) に保存されます。定期的なバックアップを行ってください。
- **Git管理**: `rack_manager.db`（実データ）は機密情報保護のため、Gitリポジトリへのコミットから除外してください。

---

## 📄 ライセンス
MIT License
