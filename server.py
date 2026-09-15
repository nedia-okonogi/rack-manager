#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DataCenter Rack Manager v5 - FastAPI + SQLite Server
High performance REST API backend, real ICMP Ping execution, VLAN & Port IP Manager.
"""

import os
import sys
import time
import json
import platform
import subprocess
import re
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional, List

from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import database

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # アプリ起動時に SQLite データベース初期化
    database.init_db()
    print("[FastAPI] SQLite database initialized and ready.")
    yield
    print("[FastAPI] Server shutting down.")

app = FastAPI(
    title="DataCenter Rack Manager v0.6.1",
    description="FastAPI + SQLite + Real ICMP Ping + VLAN/Port IP & Floor External Cable Rack Management System",
    version="0.6.1",
    lifespan=lifespan
)

# CORS許可
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ICMP Ping ユーティリティ ---
def sanitize_host(ip: str) -> str:
    """IPアドレス・ホスト名からプロトコル、CIDR、ポート番号をトリムして純粋なホストを抽出"""
    h = ip.strip()
    # http://, https:// の除去
    h = re.sub(r"^https?:\/\/", "", h, flags=re.IGNORECASE)
    # CIDR (/24など) やパスの除去
    h = h.split("/")[0]
    # ポート番号 (:8080など) の除去 (IPv4 / ホスト名の場合)
    if ":" in h and not h.startswith("[") and h.count(":") == 1:
        h = h.split(":")[0]
    return h.strip()

def execute_ping(ip: str, timeout_ms: int = 2000) -> Dict[str, Any]:
    """OSネイティブの ping コマンドで実測 ICMP Ping を実行 (WAN/グローバルIP最適化対応)"""
    ip_clean = sanitize_host(ip)
    
    # セキュリティ: 基本的なホスト名/IP形式検証
    if not ip_clean or not re.match(r"^[0-9a-zA-Z\.\:\-]+$", ip_clean):
        return {"status": "unmonitored", "responseTimeMs": None, "error": "Invalid IP"}

    # WAN / インターネット経路での初期ARP・ルーティング遅延に対応するため最低2000ms確保
    effective_timeout_ms = max(2000, int(timeout_ms))
    timeout_sec = max(2, effective_timeout_ms // 1000)

    is_win = platform.system().lower() == "windows"
    # パケットロスによる誤検知を防ぐため2パケット送信
    if is_win:
        cmd = ["ping", "-n", "2", "-w", str(effective_timeout_ms), ip_clean]
    else:
        cmd = ["ping", "-c", "2", "-W", str(timeout_sec), ip_clean]

    start_time = time.time()
    try:
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=(effective_timeout_ms / 1000.0) * 2.0 + 2.5
        )
        elapsed_ms = round((time.time() - start_time) * 1000)
        
        # エンコーディング対応 (WindowsのCP932/Shift-JISおよびUTF-8両対応)
        raw_out = proc.stdout or b""
        try:
            output = raw_out.decode("cp932")
        except Exception:
            try:
                output = raw_out.decode("utf-8", errors="replace")
            except Exception:
                output = str(raw_out)

        # 応答成功の確実な判定: TTL (Time to Live) が出力に含まれるかどうか
        is_success = bool(re.search(r"TTL=\d+", output, re.IGNORECASE))

        if is_success:
            # 応答時間 (ms) の抽出 (最小応答時間を採用)
            time_matches = re.findall(r"(?:time|時間|平均|Average)[=<]?\s*([0-9\.]+)\s*ms", output, re.IGNORECASE)
            if not time_matches:
                time_matches = re.findall(r"[=<]\s*([0-9\.]+)\s*ms", output, re.IGNORECASE)
            
            if time_matches:
                r_time = min([float(t) for t in time_matches])
            else:
                r_time = max(1.0, float(elapsed_ms // 2))

            return {
                "status": "online",
                "responseTimeMs": r_time,
                "lastChecked": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
        else:
            return {
                "status": "offline",
                "responseTimeMs": None,
                "lastChecked": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
    except subprocess.TimeoutExpired:
        return {
            "status": "offline",
            "responseTimeMs": None,
            "lastChecked": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "error": "Timeout"
        }
    except Exception as e:
        return {
            "status": "offline",
            "responseTimeMs": None,
            "lastChecked": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "error": str(e)
        }

# --- REST API エンドポイント ---

@app.get("/api/health")
async def health_check():
    """サーバーおよびSQLiteデータベースの稼働状況ヘルスチェック"""
    return {
        "status": "healthy",
        "backend": "FastAPI",
        "database": "SQLite3 (rack_manager.db)",
        "version": "4.0.0",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

@app.get("/api/data")
async def get_data():
    """SQLiteから全データ（ラック・機器・配線・変更履歴・設定）を取得"""
    try:
        data = database.get_full_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database read error: {str(e)}")

@app.post("/api/data")
async def save_data(payload: Dict[str, Any]):
    """フロントエンドからの全体データをSQLiteへトランザクション保存"""
    try:
        database.save_full_data(payload)
        return {
            "success": True,
            "message": "Data successfully saved to SQLite database.",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database write error: {str(e)}")

@app.post("/api/ping/single")
async def ping_single_device(payload: Dict[str, Any]):
    """単一機器に対するリアルタイム ICMP Ping 実行"""
    device_id = payload.get("deviceId")
    ip = payload.get("ip")
    timeout_ms = payload.get("timeoutMs", 1500)

    if not ip:
        raise HTTPException(status_code=400, detail="IP address is required for ping.")

    result = execute_ping(ip, timeout_ms)

    if device_id:
        database.update_device_ping_status(
            device_id=device_id,
            status=result["status"],
            response_time_ms=result["responseTimeMs"],
            last_checked=result["lastChecked"]
        )

    return {
        "deviceId": device_id,
        "ip": ip,
        **result
    }

@app.post("/api/ping/all")
async def ping_all_devices(payload: Optional[Dict[str, Any]] = None):
    """登録されているすべての監視有効機器に対して並列 ICMP Ping を実行"""
    full_data = database.get_full_data()
    devices_to_ping = []

    for rack in full_data.get("racks", []):
        for dev in rack.get("devices", []):
            if dev.get("pingEnabled") and dev.get("ip"):
                devices_to_ping.append({
                    "id": dev["id"],
                    "name": dev["name"],
                    "ip": dev["ip"]
                })

    timeout_ms = full_data.get("settings", {}).get("pingTimeoutMs", 1500)
    results = []

    def ping_worker(dev_item):
        p_res = execute_ping(dev_item["ip"], timeout_ms)
        database.update_device_ping_status(
            device_id=dev_item["id"],
            status=p_res["status"],
            response_time_ms=p_res["responseTimeMs"],
            last_checked=p_res["lastChecked"]
        )
        return {
            "id": dev_item["id"],
            "name": dev_item["name"],
            "ip": dev_item["ip"],
            **p_res
        }

    with ThreadPoolExecutor(max_workers=16) as executor:
        results = list(executor.map(ping_worker, devices_to_ping))

    return {
        "success": True,
        "totalPinged": len(results),
        "results": results,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }

# --- 静的ファイル (SPA) のマウント ---
app.mount("/", StaticFiles(directory=BASE_DIR, html=True), name="static")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8005))
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])

    print(f"==================================================")
    print(f"  DataCenter Rack Manager v0.6.1 (FastAPI + SQLite + VLAN)")
    print(f"  URL: http://localhost:{port}/")
    print(f"  API Docs: http://localhost:{port}/docs")
    print(f"==================================================")

    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
