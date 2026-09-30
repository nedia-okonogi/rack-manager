#!/usr/bin/env bash
# DataCenter Rack Manager v0.6.1 - Linux / macOS Launcher

echo "================================================================"
echo "  DataCenter Rack Manager v0.6.1 - L3 / Router VLAN & Port IP Manager"
echo "================================================================"
echo "[1/2] Checking python requirements..."
python3 -m pip install -r requirements.txt --quiet

echo "[2/2] Starting FastAPI Server on http://localhost:8005/ ..."
echo "API Docs: http://localhost:8005/docs"
echo "Press Ctrl+C to stop."
echo "================================================================"

python3 server.py 8005
