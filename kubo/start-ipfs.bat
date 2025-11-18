@echo off
echo ========================================
echo   Starting IPFS Daemon
echo ========================================
echo.
echo IPFS will start on:
echo  - API: http://localhost:5001
echo  - Gateway: http://localhost:8080
echo  - Web UI: http://localhost:5001/webui
echo.
echo Keep this window open while using the Land Registry app!
echo Press Ctrl+C to stop IPFS daemon
echo.
echo ========================================
echo.

ipfs.exe daemon

