#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DataCenter Rack Manager v4 - Zero-Dependency SQLite Server
Runs on Python 3 Standard Library ONLY (No pip / No FastAPI / No Uvicorn required).
Provides identical REST API endpoints and SQLite database persistence.

Usage:
  python server_standalone.py 8003
  python3 server_standalone.py 8003
"""

import http.server
import socketserver
import json
import os
import sys
import time
import platform
import subprocess
import re
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse

import database

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def execute_ping(ip: str, timeout_ms: int = 1500):
    ip_clean = ip.strip()
    if not ip_clean or not re.match(r"^[0-9a-zA-Z\.\:\-]+$", ip_clean):
        return {"status": "unmonitored", "responseTimeMs": None, "error": "Invalid IP"}

    is_win = platform.system().lower() == "windows"
    timeout_sec = max(1, timeout_ms // 1000)

    if is_win:
        cmd = ["ping", "-n", "1", "-w", str(timeout_ms), ip_clean]
    else:
        cmd = ["ping", "-c", "1", "-W", str(timeout_sec), ip_clean]

    start_time = time.time()
    try:
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=(timeout_ms / 1000.0) + 1.0
        )
        elapsed_ms = round((time.time() - start_time) * 1000)
        output = proc.stdout

        if proc.returncode == 0:
            time_match = re.search(r"(?:time|時間)[=<]?\s*([0-9\.]+)\s*ms", output, re.IGNORECASE)
            r_time = float(time_match.group(1)) if time_match else elapsed_ms
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
    except Exception as e:
        return {
            "status": "offline",
            "responseTimeMs": None,
            "lastChecked": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "error": str(e)
        }

class StandaloneHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # CORS & No-Cache
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            res = {
                "status": "healthy",
                "backend": "Python Standard Library (Zero-Dependency)",
                "database": "SQLite3 (rack_manager.db)",
                "version": "4.0.0",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            return

        if path == "/api/data":
            try:
                data = database.get_full_data()
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        # ルートまたは通常ファイル配信
        if path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_len = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_len) if content_len > 0 else b"{}"

        try:
            payload = json.loads(post_body.decode("utf-8")) if post_body else {}
        except Exception:
            payload = {}

        if path == "/api/data":
            try:
                database.save_full_data(payload)
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                res = {
                    "success": True,
                    "message": "Saved to SQLite successfully.",
                    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
                }
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
            return

        if path == "/api/ping/single":
            device_id = payload.get("deviceId")
            ip = payload.get("ip")
            timeout_ms = payload.get("timeoutMs", 1500)

            if not ip:
                self.send_response(400)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing IP"}).encode("utf-8"))
                return

            result = execute_ping(ip, timeout_ms)
            if device_id:
                database.update_device_ping_status(
                    device_id=device_id,
                    status=result["status"],
                    response_time_ms=result["responseTimeMs"],
                    last_checked=result["lastChecked"]
                )

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            res = {"deviceId": device_id, "ip": ip, **result}
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            return

        if path == "/api/ping/all":
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

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            res = {
                "success": True,
                "totalPinged": len(results),
                "results": results,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }
            self.wfile.write(json.dumps(res, ensure_ascii=False).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

def run_server(port=8003):
    database.init_db()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", port), StandaloneHandler) as httpd:
        print(f"==================================================")
        print(f"  DataCenter Rack Manager v4 (Zero-Dependency)")
        print(f"  Python Standard Library + SQLite Database")
        print(f"  URL: http://localhost:{port}/")
        print(f"==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopping...")
            httpd.server_close()

if __name__ == "__main__":
    port = 8003
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)
