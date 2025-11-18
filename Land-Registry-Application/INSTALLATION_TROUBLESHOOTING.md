# Installation Troubleshooting Guide

## Issue: Python Required for Native Module Compilation

### Problem
When running `npm install`, you may encounter errors like:
```
gyp ERR! find Python
gyp ERR! find Python Python is not set from command line or npm configuration
```

This happens because some npm packages (like `bufferutil`, `utf-8-validate`) are native modules that need to be compiled using `node-gyp`, which requires Python.

### Solution 1: Install Python 3.x (Recommended)

1. **Download Python 3.11 or 3.12** (3.6+ required):
   - Visit: https://www.python.org/downloads/
   - Download the latest Python 3.x for Windows
   - **IMPORTANT:** During installation, check ✅ **"Add Python to PATH"**

2. **Verify Python Installation:**
   ```bash
   python --version
   # Should show: Python 3.x.x
   ```

3. **Configure npm to use Python:**
   ```bash
   npm config set python "C:\Users\Geetha\AppData\Local\Programs\Python\Python311\python.exe"
   ```
   (Replace the path with your actual Python installation path)

4. **Install Visual Studio Build Tools** (REQUIRED for native modules):
   
   **Option A: Install Visual Studio Build Tools (Recommended)**
   - Download: https://visualstudio.microsoft.com/downloads/
   - Scroll down to "All Downloads" → "Tools for Visual Studio"
   - Download "Build Tools for Visual Studio 2022"
   - Run installer and select:
     - ✅ **"Desktop development with C++"** workload
     - ✅ **"C++ CMake tools for Windows"** (optional but recommended)
   - Click "Install" (this will take 5-10 minutes)
   
   **Option B: Use windows-build-tools (Older method, may not work on newer systems)**
   ```bash
   npm install --global windows-build-tools
   ```
   Note: This method is deprecated and may not work on Windows 11 or ARM64 systems.

5. **Retry npm install:**
   ```bash
   npm install
   ```

### Solution 2: Install Windows Build Tools (All-in-One)

This installs both Python and Visual C++ Build Tools:

1. **Run PowerShell as Administrator:**
   - Right-click PowerShell → "Run as Administrator"

2. **Install windows-build-tools:**
   ```bash
   npm install --global windows-build-tools
   ```
   This may take 10-15 minutes. It installs:
   - Python 2.7
   - Visual C++ Build Tools
   - All necessary dependencies

3. **After installation, retry:**
   ```bash
   npm install
   ```

### Solution 3: Use Pre-built Binaries (Skip Native Modules)

If you don't need the native modules, you can skip them:

1. **Set environment variable:**
   ```bash
   set npm_config_build_from_source=false
   ```

2. **Or use npm install with flag:**
   ```bash
   npm install --no-optional
   ```

3. **Or install without building:**
   ```bash
   npm install --ignore-scripts
   ```
   **Note:** This may cause some features to not work if they depend on native modules.

### Solution 4: Fix Python PATH Issues

If Python is installed but not found:

1. **Find Python installation:**
   ```bash
   where python
   ```

2. **Add Python to PATH manually:**
   - Open "Environment Variables" (Win + R → `sysdm.cpl` → Advanced → Environment Variables)
   - Edit "Path" under "User variables"
   - Add: `C:\Users\Geetha\AppData\Local\Programs\Python\Python311`
   - Add: `C:\Users\Geetha\AppData\Local\Programs\Python\Python311\Scripts`
   - Replace path with your actual Python installation

3. **Restart terminal/PowerShell** and verify:
   ```bash
   python --version
   ```

### Solution 5: Use Node.js LTS Version (Alternative)

Sometimes newer Node.js versions have compatibility issues. Try using Node.js LTS:

1. **Install Node.js LTS (v18 or v20):**
   - Download from: https://nodejs.org/
   - Choose LTS version

2. **Reinstall dependencies:**
   ```bash
   npm install
   ```

### Quick Fix Commands (Run in Order)

```bash
# 1. Install Python 3.11+ (from python.org, check "Add to PATH")

# 2. Verify Python
python --version

# 3. Configure npm
npm config set python "C:\Users\Geetha\AppData\Local\Programs\Python\Python311\python.exe"

# 4. Install build tools (as Administrator)
npm install --global windows-build-tools

# 5. Clean npm cache
npm cache clean --force

# 6. Remove node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# 7. Reinstall
npm install
```

### For ARM64 Windows (Your System)

Since you're on ARM64 (`win32 | arm64`), you may need:

1. **Python for ARM64:**
   - Download from: https://www.python.org/downloads/windows/
   - Choose ARM64 installer

2. **Visual Studio Build Tools for ARM64:**
   - Install Visual Studio 2022 with ARM64 support

### Verify Installation

After fixing, verify everything works:

```bash
# Check Python
python --version

# Check npm config
npm config get python

# Check node-gyp
npm list -g node-gyp

# Try installing a test native module
npm install bufferutil --save-dev
```

### Common Issues

**Issue:** "Python executable not found"
- **Fix:** Ensure Python is in PATH or use `npm config set python`

**Issue:** "Visual C++ Build Tools not found"
- **Fix:** Install Visual Studio Build Tools or `windows-build-tools`

**Issue:** "Permission denied"
- **Fix:** Run PowerShell/Command Prompt as Administrator

**Issue:** "EPERM error" (file locked)
- **Fix:** Close all programs using node_modules, restart computer, or:
  ```bash
  npm cache clean --force
  rmdir /s /q node_modules
  npm install
  ```

**Issue:** "gyp ERR! find VS" or "Could not find any Visual Studio installation"
- **Fix:** Install Visual Studio Build Tools 2022:
  1. Download: https://visualstudio.microsoft.com/downloads/
  2. Choose "Build Tools for Visual Studio 2022"
  3. Select "Desktop development with C++" workload
  4. Install and restart terminal
  5. Retry `npm install`

**Issue:** "EPERM: operation not permitted" in OneDrive folder
- **Cause:** OneDrive sync locks files during synchronization
- **Fix Options:**
  1. **Pause OneDrive sync temporarily:**
     - Right-click OneDrive icon in system tray
     - Click "Pause syncing" → "2 hours"
     - Run `npm install`
     - Resume syncing after installation
   
  2. **Move project outside OneDrive:**
     - Move project to: `C:\Projects\Land-Registry-Application`
     - Run `npm install` from new location
   
  3. **Exclude node_modules from OneDrive:**
     - OneDrive Settings → Sync and backup → Advanced settings
     - Add `node_modules` to excluded folders
   
  4. **Close OneDrive completely:**
     - Task Manager → End "OneDrive" process
     - Run `npm install`
     - Restart OneDrive

### Still Having Issues?

1. **Check Node.js version compatibility:**
   - Node.js v24.10.0 might have compatibility issues
   - Try Node.js v18 LTS or v20 LTS

2. **Check OneDrive sync (CRITICAL for your setup):**
   - Your project is in OneDrive: `C:\Users\Geetha\OneDrive\Documents\...`
   - OneDrive frequently locks files during sync, causing EPERM errors
   - **Best Solution:** Move project outside OneDrive:
     ```bash
     # Create project folder outside OneDrive
     mkdir C:\Projects
     # Move or copy project there
     xcopy "C:\Users\Geetha\OneDrive\Documents\Land_Register" "C:\Projects\Land_Register" /E /I
     cd C:\Projects\Land_Register\Land-Registry-Application
     npm install
     ```
   - **Alternative:** Pause OneDrive sync during installation

3. **Check antivirus:**
   - Temporarily disable antivirus during installation
   - Add project folder to antivirus exclusions

4. **Use yarn instead of npm:**
   ```bash
   npm install -g yarn
   yarn install
   ```

---

## Issue: Global npm Install Fails (e.g., `npm install -g truffle`)

### Problem
When trying to install packages globally, you may encounter permission errors or the same Python/Build Tools issues.

### Solutions

**Solution 1: Fix npm Global Directory Permissions**
```bash
# Check current global directory
npm config get prefix

# If it's in Program Files, change it to user directory
npm config set prefix "%APPDATA%\npm"

# Add to PATH (if not already there)
# Add: C:\Users\Geetha\AppData\Roaming\npm
```

**Solution 2: Run as Administrator**
- Right-click PowerShell/Command Prompt
- Select "Run as Administrator"
- Run: `npm install -g truffle`

**Solution 3: Use npx Instead (No Global Install Needed)**
```bash
# Instead of: npm install -g truffle
# Use npx (comes with npm):
npx truffle compile
npx truffle migrate
```

**Solution 4: Install Truffle Locally in Project**
```bash
cd Land-Registry-Application
npm install truffle --save-dev
# Then use: npx truffle or npm run truffle
```

---

## Issue: core-js Deprecation Warning

### Problem
You may see warnings like:
```
npm warn Please, upgrade your dependencies to the actual version of core-js.
```

### Explanation
- This is a **warning, not an error** - installation will still work
- Some old dependencies use outdated `core-js@2.x` which is deprecated
- The warning comes from transitive dependencies (not your direct dependencies)

### Solution
**Option 1: Ignore the Warning (Recommended)**
- The warning is harmless for now
- Your app uses `core-js@3.x` through `react-app-polyfill`
- Old dependencies will be updated when you upgrade React/other packages

**Option 2: Force Update (Advanced - May Break Things)**
```bash
npm install core-js@^3.46.0 --save
```
⚠️ **Warning:** This may cause compatibility issues with older packages. Only do this if you understand the risks.

---

**Note:** The `bufferutil` package is an optional dependency used for WebSocket performance. If you skip it, the application should still work, but WebSocket connections may be slightly slower.

