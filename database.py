#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DataCenter Rack Manager v4 - SQLite Database Management Layer
Provides schema definitions, migrations, initial seeding, and atomic CRUD operations.
"""

import sqlite3
import json
import os
import threading
from typing import Dict, Any, List, Optional

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "rack_manager.db")
SEED_FILE = os.path.join(BASE_DIR, "data.json")

db_lock = threading.Lock()

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=30.0, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA synchronous = NORMAL")
    conn.execute("PRAGMA busy_timeout = 30000")
    return conn

def init_db():
    """テーブルの初期化と初期シードデータの投入"""
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.executescript("""
        CREATE TABLE IF NOT EXISTS racks (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            units INTEGER DEFAULT 42,
            tags TEXT,
            sort_order INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS devices (
            id TEXT PRIMARY KEY,
            rack_id TEXT NOT NULL,
            name TEXT NOT NULL,
            ip TEXT,
            vip TEXT,
            ha_role TEXT DEFAULT 'standalone',
            ha_pair_id TEXT,
            hostname TEXT,
            vendor TEXT,
            model TEXT,
            size_u INTEGER DEFAULT 1,
            start_u INTEGER NOT NULL,
            side TEXT DEFAULT 'front',
            slot_width TEXT DEFAULT 'full',
            slot_col INTEGER DEFAULT 1,
            type TEXT DEFAULT 'rackmount',
            port_count INTEGER DEFAULT 4,
            power_watts INTEGER DEFAULT 350,
            tags TEXT,
            ping_enabled INTEGER DEFAULT 1,
            status TEXT DEFAULT 'unknown',
            response_time_ms REAL,
            last_checked TEXT,
            notes TEXT,
            port_configs TEXT,
            ticket_no TEXT,
            install_date TEXT,
            FOREIGN KEY (rack_id) REFERENCES racks(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS cables (
            id TEXT PRIMARY KEY,
            from_device_id TEXT NOT NULL,
            from_port INTEGER NOT NULL,
            to_device_id TEXT NOT NULL,
            to_port INTEGER NOT NULL,
            external_target TEXT,
            color TEXT DEFAULT '#38bdf8',
            side TEXT DEFAULT 'front',
            label TEXT,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS change_logs (
            id TEXT PRIMARY KEY,
            change_date TEXT NOT NULL,
            ticket_no TEXT NOT NULL,
            hostname TEXT NOT NULL,
            device_id TEXT,
            change_type TEXT NOT NULL,
            operator TEXT NOT NULL,
            reason TEXT NOT NULL,
            device_snapshot TEXT,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS storage_devices (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            ip TEXT,
            vip TEXT,
            ha_role TEXT DEFAULT 'standalone',
            ha_pair_id TEXT,
            hostname TEXT,
            vendor TEXT,
            model TEXT,
            size_u INTEGER DEFAULT 1,
            start_u INTEGER,
            side TEXT DEFAULT 'front',
            slot_width TEXT DEFAULT 'full',
            slot_col INTEGER DEFAULT 1,
            type TEXT DEFAULT 'rackmount',
            port_count INTEGER DEFAULT 4,
            power_watts INTEGER DEFAULT 350,
            tags TEXT,
            ping_enabled INTEGER DEFAULT 1,
            status TEXT DEFAULT 'unknown',
            response_time_ms REAL,
            last_checked TEXT,
            notes TEXT,
            port_configs TEXT,
            ticket_no TEXT,
            unmounted_at TEXT,
            unmounted_from_rack TEXT,
            unmounted_from_u INTEGER,
            raw_json TEXT
        );

        CREATE TABLE IF NOT EXISTS other_locations (
            id TEXT PRIMARY KEY,
            name TEXT,
            management_no TEXT,
            vendor TEXT,
            model TEXT,
            type TEXT DEFAULT 'laptop',
            ip TEXT,
            location TEXT,
            office TEXT,
            installed_at TEXT,
            notes TEXT,
            tags TEXT,
            custom_fields TEXT,
            raw_json TEXT
        );

        CREATE TABLE IF NOT EXISTS other_location_columns (
            id TEXT PRIMARY KEY,
            key TEXT UNIQUE,
            name TEXT,
            type TEXT DEFAULT 'text',
            order_num INTEGER,
            visible INTEGER DEFAULT 1,
            required INTEGER DEFAULT 0
        );

        CREATE INDEX IF NOT EXISTS idx_devices_rack_id ON devices(rack_id);
        CREATE INDEX IF NOT EXISTS idx_change_logs_date ON change_logs(change_date);
        CREATE INDEX IF NOT EXISTS idx_change_logs_ticket ON change_logs(ticket_no);
        CREATE INDEX IF NOT EXISTS idx_storage_devices_unmounted ON storage_devices(unmounted_at);
        """)

        conn.commit()

        # マイグレーション: cables の external_target 追加
        cursor.execute("PRAGMA table_info(cables)")
        cable_cols = [c[1] for c in cursor.fetchall()]
        if "external_target" not in cable_cols:
            cursor.execute("ALTER TABLE cables ADD COLUMN external_target TEXT")

        # マイグレーション: devices の ticket_no, install_date 追加
        cursor.execute("PRAGMA table_info(devices)")
        dev_cols = [c[1] for c in cursor.fetchall()]
        if "ticket_no" not in dev_cols:
            cursor.execute("ALTER TABLE devices ADD COLUMN ticket_no TEXT")
        if "install_date" not in dev_cols:
            cursor.execute("ALTER TABLE devices ADD COLUMN install_date TEXT")

        # マイグレーション: other_locations の新カラム追加
        cursor.execute("PRAGMA table_info(other_locations)")
        existing_cols = [c[1] for c in cursor.fetchall()]
        if "management_no" not in existing_cols:
            cursor.execute("ALTER TABLE other_locations ADD COLUMN management_no TEXT")
        if "model" not in existing_cols:
            cursor.execute("ALTER TABLE other_locations ADD COLUMN model TEXT")

        # デフォルトカラム（設置日時、管理番号、メーカー、型番、デバイス名、IP、設置場所、Office、備考）
        cursor.execute("SELECT COUNT(*) FROM other_location_columns")
        col_count = cursor.fetchone()[0]
        if col_count == 0 or col_count == 7: # 初期または旧7項目の場合は最新9項目に更新
            cursor.execute("DELETE FROM other_location_columns")
            default_cols = [
                ("col-1", "installedAt", "設置日時", "datetime", 1, 1, 0),
                ("col-2", "managementNo", "管理番号", "text", 2, 1, 0),
                ("col-3", "vendor", "メーカー", "text", 3, 1, 0),
                ("col-4", "model", "型番", "text", 4, 1, 0),
                ("col-5", "name", "デバイス名", "text", 5, 1, 1),
                ("col-6", "ip", "IP", "text", 6, 1, 0),
                ("col-7", "location", "設置場所", "text", 7, 1, 0),
                ("col-8", "office", "Office", "text", 8, 1, 0),
                ("col-9", "notes", "備考", "text", 9, 1, 0)
            ]
            cursor.executemany("""
            INSERT OR REPLACE INTO other_location_columns (id, key, name, type, order_num, visible, required)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """, default_cols)
            conn.commit()

        # テーブルが空の場合、data.json またはデフォルトシードをインポート
        cursor.execute("SELECT COUNT(*) FROM racks")
        rack_count = cursor.fetchone()[0]
        if rack_count == 0:
            seed_initial_data(conn)

        conn.close()

def seed_initial_data(conn: sqlite3.Connection):
    """初期データのシード処理"""
    seed_data = None
    if os.path.exists(SEED_FILE):
        try:
            with open(SEED_FILE, "r", encoding="utf-8") as f:
                seed_data = json.load(f)
        except Exception as e:
            print(f"[DB Warning] Could not read {SEED_FILE}: {e}")

    if not seed_data or not seed_data.get("racks"):
        seed_data = {
            "settings": {
                "pingIntervalSeconds": 30,
                "pingTimeoutMs": 1500,
                "globalPingEnabled": True,
                "autoPingEnabled": False,
                "viewMode": "front"
            },
            "racks": [
                {
                    "id": "rack-1",
                    "name": "Rack A-01",
                    "units": 42,
                    "tags": ["Zone-A", "Web Cluster", "1F DataCenter"],
                    "devices": []
                }
            ],
            "cables": [],
            "changeLogs": []
        }

    if "otherLocations" not in seed_data or not seed_data["otherLocations"]:
        seed_data["otherLocations"] = [
            {
                "id": "loc-dev-01",
                "name": "ThinkPad-Sales01",
                "vendor": "Lenovo",
                "type": "laptop",
                "ip": "192.168.20.110",
                "location": "3F 営業企画室 デスク04",
                "office": "Microsoft 365 Apps",
                "installedAt": "2026-08-01 09:00",
                "notes": "外回り・テレワーク貸出用端末",
                "tags": ["ノートPC", "営業部", "Wi-Fi接続"]
            },
            {
                "id": "loc-dev-02",
                "name": "OptiPlex-Admin",
                "vendor": "Dell",
                "type": "desktop_pc",
                "ip": "192.168.10.150",
                "location": "2F 総務部 集中端末デスク",
                "office": "Office 2021 Pro",
                "installedAt": "2026-07-15 10:30",
                "notes": "基幹システム入力用固定PC",
                "tags": ["デスクトップPC", "総務部", "有線LAN"]
            }
        ]

    save_full_data_internal(conn, seed_data)
    conn.commit()
    print("[DB] Initial SQLite seed data loaded and committed successfully.")

def get_full_data() -> Dict[str, Any]:
    """フロントエンド用のフルデータセット（racks, cables, changeLogs, settings）を取得"""
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 1. Settings
        cursor.execute("SELECT key, value FROM settings")
        settings_rows = cursor.fetchall()
        settings = {
            "pingIntervalSeconds": 30,
            "pingTimeoutMs": 1500,
            "globalPingEnabled": True,
            "autoPingEnabled": False,
            "viewMode": "front"
        }
        for row in settings_rows:
            k = row["key"]
            v = row["value"]
            try:
                settings[k] = json.loads(v)
            except Exception:
                settings[k] = v

        def parse_tags_helper(raw_val):
            if not raw_val:
                return []
            if isinstance(raw_val, list):
                return [str(t).strip().strip('"').strip("'").strip('[]') for t in raw_val if str(t).strip().strip('"').strip("'").strip('[]')]
            raw_str = str(raw_val).strip()
            if raw_str.startswith("[") and raw_str.endswith("]"):
                try:
                    parsed = json.loads(raw_str)
                    if isinstance(parsed, list):
                        return [str(t).strip().strip('"').strip("'") for t in parsed if str(t).strip().strip('"').strip("'")]
                except Exception:
                    pass
            tags = []
            for item in raw_str.split(","):
                cleaned = item.strip().strip('"').strip("'").strip('[]')
                if cleaned:
                    tags.append(cleaned)
            return tags

        # 2. Racks & Devices
        cursor.execute("SELECT * FROM racks ORDER BY sort_order ASC, rowid ASC")
        racks_rows = cursor.fetchall()
        racks = []
        for r_row in racks_rows:
            rack_id = r_row["id"]
            tags = parse_tags_helper(r_row["tags"])

            # 機器一覧
            cursor.execute("SELECT * FROM devices WHERE rack_id = ? ORDER BY start_u DESC", (rack_id,))
            dev_rows = cursor.fetchall()
            devices = []
            for d in dev_rows:
                dev_tags = parse_tags_helper(d["tags"])
                devices.append({
                    "id": d["id"],
                    "name": d["name"],
                    "ip": d["ip"] or "",
                    "vip": d["vip"] or "",
                    "haRole": d["ha_role"] or "standalone",
                    "haPairId": d["ha_pair_id"],
                    "hostname": d["hostname"] or "",
                    "vendor": d["vendor"] or "",
                    "model": d["model"] or "",
                    "sizeU": d["size_u"],
                    "startU": d["start_u"],
                    "side": d["side"] or "front",
                    "slotWidth": d["slot_width"] or "full",
                    "slotCol": d["slot_col"] or 1,
                    "type": d["type"] or "rackmount",
                    "portCount": d["port_count"] or 4,
                    "powerWatts": d["power_watts"] if d["power_watts"] is not None else 350,
                    "tags": dev_tags,
                    "pingEnabled": bool(d["ping_enabled"]),
                    "status": d["status"] or "unknown",
                    "responseTimeMs": d["response_time_ms"],
                    "lastChecked": d["last_checked"],
                    "notes": d["notes"] or "",
                    "portConfigs": json.loads(d["port_configs"]) if ("port_configs" in d.keys() and d["port_configs"]) else {},
                    "ticketNo": (d["ticket_no"] if "ticket_no" in d.keys() else "") or "",
                    "installDate": (d["install_date"] if "install_date" in d.keys() else "") or ""
                })

            racks.append({
                "id": rack_id,
                "name": r_row["name"],
                "units": r_row["units"] or 42,
                "tags": tags,
                "devices": devices
            })

        # 3. Cables
        cursor.execute("SELECT * FROM cables")
        cable_rows = cursor.fetchall()
        cables = []
        for c in cable_rows:
            cables.append({
                "id": c["id"],
                "fromDeviceId": c["from_device_id"],
                "fromPort": c["from_port"],
                "toDeviceId": c["to_device_id"],
                "toPort": c["to_port"],
                "externalTarget": (c["external_target"] if "external_target" in c.keys() else "") or "",
                "color": c["color"] or "#38bdf8",
                "side": c["side"] or "front",
                "label": c["label"] or ""
            })

        # 4. Change Logs
        cursor.execute("SELECT * FROM change_logs ORDER BY change_date DESC, rowid DESC")
        log_rows = cursor.fetchall()
        change_logs = []
        for l in log_rows:
            snapshot = None
            if l["device_snapshot"]:
                try:
                    snapshot = json.loads(l["device_snapshot"])
                except Exception:
                    snapshot = None

            change_logs.append({
                "id": l["id"],
                "date": l["change_date"],
                "ticketNo": l["ticket_no"],
                "hostname": l["hostname"],
                "deviceId": l["device_id"],
                "type": l["change_type"],
                "operator": l["operator"],
                "reason": l["reason"],
                "deviceSnapshot": snapshot
            })

        # 5. Storage Devices
        cursor.execute("SELECT * FROM storage_devices ORDER BY unmounted_at DESC, rowid DESC")
        storage_rows = cursor.fetchall()
        storage_devices = []
        for s in storage_rows:
            dev_obj = None
            if s["raw_json"]:
                try:
                    dev_obj = json.loads(s["raw_json"])
                except Exception:
                    dev_obj = None
            if not dev_obj:
                s_tags = parse_tags_helper(s["tags"])
                dev_obj = {
                    "id": s["id"],
                    "name": s["name"],
                    "ip": s["ip"] or "",
                    "vip": s["vip"] or "",
                    "haRole": s["ha_role"] or "standalone",
                    "haPairId": s["ha_pair_id"],
                    "hostname": s["hostname"] or "",
                    "vendor": s["vendor"] or "",
                    "model": s["model"] or "",
                    "sizeU": s["size_u"],
                    "startU": s["start_u"],
                    "side": s["side"] or "front",
                    "slotWidth": s["slot_width"] or "full",
                    "slotCol": s["slot_col"] or 1,
                    "type": s["type"] or "rackmount",
                    "portCount": s["port_count"] or 4,
                    "powerWatts": s["power_watts"] if s["power_watts"] is not None else 350,
                    "tags": s_tags,
                    "pingEnabled": bool(s["ping_enabled"]),
                    "status": s["status"] or "unknown",
                    "responseTimeMs": s["response_time_ms"],
                    "lastChecked": s["last_checked"],
                    "notes": s["notes"] or "",
                    "ticketNo": s["ticket_no"] or "",
                    "unmountedAt": s["unmounted_at"] or "",
                    "unmountedFromRack": s["unmounted_from_rack"] or "",
                    "unmountedFromU": s["unmounted_from_u"]
                }
            storage_devices.append(dev_obj)

        # 6. Other Locations
        cursor.execute("SELECT * FROM other_locations ORDER BY rowid ASC")
        other_loc_rows = cursor.fetchall()
        other_locations = []
        for ol in other_loc_rows:
            dev_obj = None
            if ol["raw_json"]:
                try:
                    dev_obj = json.loads(ol["raw_json"])
                except Exception:
                    dev_obj = None
            if not dev_obj:
                c_fields = {}
                if ol["custom_fields"]:
                    try:
                        c_fields = json.loads(ol["custom_fields"])
                    except Exception:
                        c_fields = {}
                dev_obj = {
                    "id": ol["id"],
                    "name": ol["name"] or "",
                    "managementNo": (ol["management_no"] if "management_no" in ol.keys() else "") or "",
                    "vendor": ol["vendor"] or "",
                    "model": (ol["model"] if "model" in ol.keys() else "") or "",
                    "type": ol["type"] or "laptop",
                    "ip": ol["ip"] or "",
                    "location": ol["location"] or "",
                    "office": ol["office"] or "",
                    "installedAt": ol["installed_at"] or "",
                    "notes": ol["notes"] or "",
                    "tags": parse_tags_helper(ol["tags"]),
                    "customFields": c_fields
                }
            other_locations.append(dev_obj)

        # 7. Other Location Columns
        cursor.execute("SELECT * FROM other_location_columns ORDER BY order_num ASC")
        col_rows = cursor.fetchall()
        other_location_columns = []
        for col in col_rows:
            other_location_columns.append({
                "id": col["id"],
                "key": col["key"],
                "name": col["name"],
                "type": col["type"] or "text",
                "order": col["order_num"],
                "visible": bool(col["visible"]),
                "required": bool(col["required"])
            })

        conn.close()

        return {
            "settings": settings,
            "racks": racks,
            "cables": cables,
            "changeLogs": change_logs,
            "storageDevices": storage_devices,
            "otherLocations": other_locations,
            "otherLocationColumns": other_location_columns
        }

def save_full_data(data: Dict[str, Any]):
    """トランザクション内で全データをSQLiteへ一括更新"""
    with db_lock:
        conn = get_db_connection()
        try:
            save_full_data_internal(conn, data)
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

def save_full_data_internal(conn: sqlite3.Connection, data: Dict[str, Any]):
    cursor = conn.cursor()

    # 1. Settings
    if "settings" in data and isinstance(data["settings"], dict):
        for k, v in data["settings"].items():
            val_str = json.dumps(v) if isinstance(v, (dict, list, bool, int, float)) else str(v)
            cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (k, val_str))

    # 2. Racks & Devices
    if "racks" in data and isinstance(data["racks"], list):
        # 既存ラックと機器をクリアして入れ替え
        cursor.execute("DELETE FROM devices")
        cursor.execute("DELETE FROM racks")

        for sort_idx, rack in enumerate(data["racks"]):
            rack_id = rack.get("id") or f"rack-{sort_idx+1}"
            name = rack.get("name") or f"Rack {sort_idx+1}"
            units = rack.get("units") or 42
            tags = rack.get("tags") or []
            tags_str = ",".join(tags) if isinstance(tags, list) else str(tags)

            cursor.execute(
                "INSERT INTO racks (id, name, units, tags, sort_order) VALUES (?, ?, ?, ?, ?)",
                (rack_id, name, units, tags_str, sort_idx)
            )

            # 機器登録
            devices = rack.get("devices") or []
            for dev in devices:
                dev_id = dev.get("id") or f"dev-{os.urandom(4).hex()}"
                dev_name = dev.get("name") or "New Device"
                dev_tags = dev.get("tags") or []
                dev_tags_str = ",".join(dev_tags) if isinstance(dev_tags, list) else str(dev_tags)

                cursor.execute("""
                INSERT INTO devices (
                    id, rack_id, name, ip, vip, ha_role, ha_pair_id, hostname, vendor, model,
                    size_u, start_u, side, slot_width, slot_col, type, port_count, power_watts,
                    tags, ping_enabled, status, response_time_ms, last_checked, notes, port_configs,
                    ticket_no, install_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    dev_id,
                    rack_id,
                    dev_name,
                    dev.get("ip") or "",
                    dev.get("vip") or "",
                    dev.get("haRole") or "standalone",
                    dev.get("haPairId"),
                    dev.get("hostname") or "",
                    dev.get("vendor") or "",
                    dev.get("model") or "",
                    dev.get("sizeU") or 1,
                    dev.get("startU") or 1,
                    dev.get("side") or "front",
                    dev.get("slotWidth") or "full",
                    dev.get("slotCol") or 1,
                    dev.get("type") or "rackmount",
                    dev.get("portCount") or 4,
                    dev.get("powerWatts") if dev.get("powerWatts") is not None else 350,
                    dev_tags_str,
                    1 if dev.get("pingEnabled", True) else 0,
                    dev.get("status") or "unknown",
                    dev.get("responseTimeMs"),
                    dev.get("lastChecked"),
                    dev.get("notes") or "",
                    json.dumps(dev.get("portConfigs", {}), ensure_ascii=False) if dev.get("portConfigs") else None,
                    dev.get("ticketNo") or "",
                    dev.get("installDate") or ""
                ))

    # 3. Cables
    if "cables" in data and isinstance(data["cables"], list):
        cursor.execute("DELETE FROM cables")
        for c in data["cables"]:
            c_id = c.get("id") or f"cable-{os.urandom(4).hex()}"
            cursor.execute("""
            INSERT INTO cables (id, from_device_id, from_port, to_device_id, to_port, external_target, color, side, label)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                c_id,
                c.get("fromDeviceId"),
                c.get("fromPort") or 1,
                c.get("toDeviceId") or "__external__",
                c.get("toPort") if c.get("toPort") is not None else 0,
                c.get("externalTarget") or "",
                c.get("color") or "#38bdf8",
                c.get("side") or "front",
                c.get("label") or ""
            ))

    # 4. Change Logs
    if "changeLogs" in data and isinstance(data["changeLogs"], list):
        cursor.execute("DELETE FROM change_logs")
        for log in data["changeLogs"]:
            l_id = log.get("id") or f"chg-{os.urandom(4).hex()}"
            snapshot_json = None
            if log.get("deviceSnapshot"):
                snapshot_json = json.dumps(log.get("deviceSnapshot"), ensure_ascii=False)

            cursor.execute("""
            INSERT INTO change_logs (
                id, change_date, ticket_no, hostname, device_id, change_type, operator, reason, device_snapshot
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                l_id,
                log.get("date") or "2026-08-31",
                log.get("ticketNo") or "CHG-2026-000",
                log.get("hostname") or "Device",
                log.get("deviceId"),
                log.get("type") or "other",
                log.get("operator") or "担当者",
                log.get("reason") or "",
                snapshot_json
            ))

    # 5. Storage Devices
    if "storageDevices" in data and isinstance(data["storageDevices"], list):
        cursor.execute("DELETE FROM storage_devices")
        for dev in data["storageDevices"]:
            dev_id = dev.get("id") or f"dev-{os.urandom(4).hex()}"
            dev_name = dev.get("name") or "Stored Device"
            dev_tags = dev.get("tags") or []
            dev_tags_str = ",".join(dev_tags) if isinstance(dev_tags, list) else str(dev_tags)
            raw_json = json.dumps(dev, ensure_ascii=False)

            cursor.execute("""
            INSERT INTO storage_devices (
                id, name, ip, vip, ha_role, ha_pair_id, hostname, vendor, model,
                size_u, start_u, side, slot_width, slot_col, type, port_count, power_watts,
                tags, ping_enabled, status, response_time_ms, last_checked, notes, port_configs,
                ticket_no, unmounted_at, unmounted_from_rack, unmounted_from_u, raw_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                dev_id,
                dev_name,
                dev.get("ip") or "",
                dev.get("vip") or "",
                dev.get("haRole") or "standalone",
                dev.get("haPairId"),
                dev.get("hostname") or "",
                dev.get("vendor") or "",
                dev.get("model") or "",
                dev.get("sizeU") or 1,
                dev.get("startU"),
                dev.get("side") or "front",
                dev.get("slotWidth") or "full",
                dev.get("slotCol") or 1,
                dev.get("type") or "rackmount",
                dev.get("portCount") or 4,
                dev.get("powerWatts") if dev.get("powerWatts") is not None else 350,
                dev_tags_str,
                1 if dev.get("pingEnabled", True) else 0,
                dev.get("status") or "unknown",
                dev.get("responseTimeMs"),
                dev.get("lastChecked"),
                dev.get("notes") or "",
                json.dumps(dev.get("portConfigs", {}), ensure_ascii=False) if dev.get("portConfigs") else None,
                dev.get("ticketNo") or "",
                dev.get("unmountedAt") or "",
                dev.get("unmountedFromRack") or "",
                dev.get("unmountedFromU"),
                raw_json
            ))

    # 6. Other Locations
    if "otherLocations" in data and isinstance(data["otherLocations"], list):
        cursor.execute("DELETE FROM other_locations")
        for ol in data["otherLocations"]:
            ol_id = ol.get("id") or f"loc-dev-{os.urandom(4).hex()}"
            ol_name = ol.get("name") or "Device"
            ol_tags = ol.get("tags") or []
            ol_tags_str = ",".join(ol_tags) if isinstance(ol_tags, list) else str(ol_tags)
            c_fields_json = json.dumps(ol.get("customFields", {}), ensure_ascii=False)
            raw_json = json.dumps(ol, ensure_ascii=False)

            cursor.execute("""
            INSERT OR REPLACE INTO other_locations (
                id, name, management_no, vendor, model, type, ip, location, office, installed_at, notes, tags, custom_fields, raw_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                ol_id,
                ol_name,
                ol.get("managementNo") or "",
                ol.get("vendor") or "",
                ol.get("model") or "",
                ol.get("type") or "laptop",
                ol.get("ip") or "",
                ol.get("location") or "",
                ol.get("office") or "",
                ol.get("installedAt") or "",
                ol.get("notes") or "",
                ol_tags_str,
                c_fields_json,
                raw_json
            ))

    # 7. Other Location Columns
    if "otherLocationColumns" in data and isinstance(data["otherLocationColumns"], list):
        cursor.execute("DELETE FROM other_location_columns")
        for col in data["otherLocationColumns"]:
            col_id = col.get("id") or f"col-{os.urandom(3).hex()}"
            cursor.execute("""
            INSERT OR REPLACE INTO other_location_columns (
                id, key, name, type, order_num, visible, required
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                col_id,
                col.get("key") or f"col_{os.urandom(2).hex()}",
                col.get("name") or "項目",
                col.get("type") or "text",
                col.get("order") if col.get("order") is not None else 1,
                1 if col.get("visible", True) else 0,
                1 if col.get("required", False) else 0
            ))

def update_device_ping_status(device_id: str, status: str, response_time_ms: Optional[float], last_checked: str):
    """Ping実行結果を特定の機器レコードに更新"""
    with db_lock:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
        UPDATE devices
        SET status = ?, response_time_ms = ?, last_checked = ?
        WHERE id = ?
        """, (status, response_time_ms, last_checked, device_id))
        conn.commit()
        conn.close()
