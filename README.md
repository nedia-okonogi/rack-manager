# DataCenter Rack Manager v5 (FastAPI + SQLite + VLAN & Port IP Manager)

データセンター・サーバールーム向け ラック構成管理 ＆ 変更履歴双方向同期システム **Version 5.0**

## 🌟 Version 5.0 新機能
- **L3スイッチ / ルーター ポート別 VLAN ＆ IP アドレス割り当て**:
  - 各ポートごとに動作モード（`Routed (L3/IP直付)`, `Access (端末)`, `Trunk (タグVLAN)`）を設定可能。
  - ポート固有の VLAN ID、VLAN名、および割り当てIPアドレス（CIDR表記: 例 `192.168.10.1/24`）を完全管理。
  - ポート範囲一括設定機能（例: Port 1-12 に VLAN 10 を一括適用、連番IP自動生成）。
- **ポートホバー時のリッチツールチップ**:
  - ポートにマウスを乗せるだけで、接続先情報に加えて所属VLANや割り当てIPアドレス、動作モードがひと目でわかるリッチカードを表示。
- **ラック図上のポート VLAN カラーコーディング ＆ ハイライトフィルター**:
  - ポートLEDに VLAN 固有カラー（グリーン、イエロー、レッド、パープル等）を自動反映。
  - ツールバーの「VLAN表示」セレクターから特定VLANを選択すると、該当ポートおよび接続配線がパッとハイライト発光。
- **FastAPI ＆ SQLite (`rack_manager.db`) 完全永続化**:
  - ポート設定もSQLiteデータベースへ自動保存され、リロードしても確実に復元。

## 🚀 起動方法

### Windows
`start.bat` をダブルクリックするだけで、必要なパッケージの確認とサーバー起動が自動実行されます (Port 8005)。

またはコマンドプロンプト / PowerShell から:
```powershell
cd d:\01.workspace\rack-manager-v5
python -m pip install -r requirements.txt
python server.py 8005
```

### Linux / macOS
```bash
cd /path/to/rack-manager-v5
chmod +x start.sh
./start.sh
```

ブラウザで以下のURLを開きます:
- **Web UI アプリケーション**: [http://localhost:8005/](http://localhost:8005/)
- **FastAPI インタラクティブAPI仕様書**: [http://localhost:8005/docs](http://localhost:8005/docs)

---

## 📂 ディレクトリ構成

```
rack-manager-v4/
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
└── README.md              # 本ドキュメント
```
