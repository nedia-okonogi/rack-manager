@echo off
chcp 65001 > nul
title DataCenter Rack Manager v0.6.1 (FastAPI + SQLite + VLAN)

echo ================================================================
echo   DataCenter Rack Manager v0.6.1 - L3 / Router VLAN & Port IP Manager
echo ================================================================
echo [1/2] 依存パッケージを確認中...
python -m pip install -r requirements.txt --quiet

echo [2/2] FastAPI + SQLite サーバーを起動中 (Port 8005)...
echo.
echo   Web画面:     http://localhost:8005/
echo   APIドキュメント: http://localhost:8005/docs
echo.
echo 終了するには Ctrl+C を押してください。
echo ================================================================

python server.py 8005
pause
