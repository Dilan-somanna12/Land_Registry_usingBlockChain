# Quick Start - IPFS for Land Registry

## ✅ IPFS is Already Configured!

Your IPFS node has been initialized and configured with CORS settings for the Land Registry application.

## 🚀 How to Start IPFS

### Option 1: Use the Batch File (Easiest)
Simply double-click: **`start-ipfs.bat`**

### Option 2: Manual Start
1. Open PowerShell/Command Prompt
2. Navigate to this folder:
   ```
   cd C:\Users\Asus\Documents\Documentos_De_Projectos\Land_Register\kubo
   ```
3. Run:
   ```
   .\ipfs.exe daemon
   ```

## 📍 IPFS URLs

Once the daemon is running:
- **API:** http://localhost:5001
- **Gateway:** http://localhost:8080
- **Web UI:** http://localhost:5001/webui (view your files here!)

## ⚠️ Important

**Keep the IPFS daemon running** while using the Land Registry application!
- Don't close the window where IPFS is running
- If you close it, just restart it before using the app

## 🛑 How to Stop IPFS

Press `Ctrl + C` in the terminal window where IPFS is running.

## 🔧 Your Configuration

Your IPFS repository is located at: `C:\Users\Asus\.ipfs`

CORS is configured to allow:
- `http://localhost:3000` (React app)
- `http://127.0.0.1:3000`

Methods allowed: `GET`, `POST`, `PUT`

## 📝 Usage in Land Registry App

When IPFS is running, the app will automatically:
1. Upload property documents to IPFS
2. Store images for land listings
3. Retrieve documents using their IPFS hash

All data is stored decentralized and permanent!

## ❓ Troubleshooting

### "Error: lock /Users/.../.ipfs/repo.lock"
- Another IPFS instance is already running
- Close it and try again

### "Connection refused" in the app
- Make sure IPFS daemon is running
- Check that it's running on port 5001

### Reset Configuration
If something goes wrong, you can reinitialize:
```powershell
.\ipfs.exe config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000", "http://127.0.0.1:3000"]'
.\ipfs.exe config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
```


