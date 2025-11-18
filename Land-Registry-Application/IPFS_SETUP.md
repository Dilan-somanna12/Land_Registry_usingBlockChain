# IPFS Setup Guide

This application uses IPFS (InterPlanetary File System) to store land registry documents and images in a decentralized manner.

## Why Local IPFS?

Infura's public IPFS gateway now requires authentication (project ID). For development, we've configured the app to use a local IPFS node instead.

## Installation Steps

### Windows

1. **Download IPFS**
   - Visit: https://dist.ipfs.tech/#go-ipfs
   - Download the Windows version (ipfs_v0.x.x_windows-amd64.zip)

2. **Install IPFS**
   ```powershell
   # Extract the zip file to a folder (e.g., C:\ipfs)
   # Add the ipfs.exe location to your PATH environment variable
   ```

3. **Initialize IPFS**
   ```powershell
   ipfs init
   ```

4. **Configure CORS (Required for browser access)**
   ```powershell
   ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000", "http://127.0.0.1:3000"]'
   ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
   ```

5. **Start IPFS Daemon**
   ```powershell
   ipfs daemon
   ```

   Keep this terminal window open while using the application.

### Linux/Mac

1. **Install IPFS**
   ```bash
   wget https://dist.ipfs.tech/go-ipfs/v0.17.0/go-ipfs_v0.17.0_linux-amd64.tar.gz
   tar -xvzf go-ipfs_v0.17.0_linux-amd64.tar.gz
   cd go-ipfs
   sudo bash install.sh
   ```

2. **Initialize IPFS**
   ```bash
   ipfs init
   ```

3. **Configure CORS**
   ```bash
   ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000", "http://127.0.0.1:3000"]'
   ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
   ```

4. **Start IPFS Daemon**
   ```bash
   ipfs daemon
   ```

## Verify IPFS is Running

1. Open a new terminal and run:
   ```bash
   ipfs id
   ```

2. Or visit in your browser: http://localhost:5001/webui

## Usage in Application

Once the IPFS daemon is running, the application will automatically:
- Upload land registry documents to IPFS
- Store images for property listings
- Retrieve documents using their IPFS hash

## Alternative: Use Infura (Requires Account)

If you prefer to use Infura instead of running a local node:

1. Create an account at https://infura.io
2. Create a new IPFS project
3. Get your Project ID and Project Secret
4. Update `src/ipfs.js`:

```javascript
const IPFS = require('ipfs-api')

const projectId = 'YOUR_PROJECT_ID'
const projectSecret = 'YOUR_PROJECT_SECRET'
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfs = new IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

export default ipfs
```

## Troubleshooting

### Error: "Failed to load resource: the server responded with a status of 401"
- IPFS daemon is not running
- CORS is not configured properly
- Run the CORS configuration commands again

### Error: "connect ECONNREFUSED 127.0.0.1:5001"
- IPFS daemon is not running
- Start it with: `ipfs daemon`

### Port Already in Use
- Another IPFS instance is running
- Stop it and restart: `ipfs shutdown && ipfs daemon`

