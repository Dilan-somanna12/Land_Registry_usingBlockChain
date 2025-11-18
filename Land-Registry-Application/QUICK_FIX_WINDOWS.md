# Quick Fix Guide for Windows Installation Issues

## Your Current Errors:
1. ✅ Python found (good!)
2. ❌ Visual Studio Build Tools missing
3. ❌ OneDrive file locking (EPERM errors)
4. ⚠️ core-js warning (harmless)
5. ❌ Global npm install failing

## Step-by-Step Fix

### Step 1: Install Visual Studio Build Tools (REQUIRED)

1. **Download Visual Studio Build Tools:**
   - Go to: https://visualstudio.microsoft.com/downloads/
   - Scroll to "All Downloads" → "Tools for Visual Studio"
   - Click "Build Tools for Visual Studio 2022"
   - Download the installer (~3 MB)

2. **Run Installer:**
   - Run `vs_buildtools.exe`
   - Select: ✅ **"Desktop development with C++"** workload
   - Click "Install" (takes 5-10 minutes, ~6 GB download)

3. **Restart your computer** (important!)

4. **Verify installation:**
   ```bash
   # Open new PowerShell/Command Prompt
   npm config get msvs_version
   # Should show: 2022
   ```

### Step 2: Fix OneDrive File Locking (CRITICAL)

**Your project is in OneDrive, which locks files during sync!**

**Best Solution: Move Project Outside OneDrive**

```powershell
# 1. Create a new folder outside OneDrive
mkdir C:\Projects

# 2. Copy your project (not move, keep original as backup)
xcopy "C:\Users\Geetha\OneDrive\Documents\Land_Register\Land_Register" "C:\Projects\Land_Register" /E /I /H

# 3. Navigate to new location
cd C:\Projects\Land_Register\Land-Registry-Application

# 4. Now try npm install
npm install
```

**Alternative: Pause OneDrive Temporarily**
1. Right-click OneDrive icon in system tray
2. Click "Pause syncing" → "2 hours"
3. Run `npm install`
4. Resume syncing after installation

### Step 3: Fix Global npm Install (for Truffle)

**Option A: Use npx (No Global Install Needed) - RECOMMENDED**
```bash
# Instead of: npm install -g truffle
# Just use npx (comes with npm):
npx truffle compile
npx truffle migrate
```

**Option B: Fix npm Global Directory**
```bash
# Change global directory to user folder
npm config set prefix "%APPDATA%\npm"

# Verify
npm config get prefix
# Should show: C:\Users\Geetha\AppData\Roaming\npm

# Now try installing truffle
npm install -g truffle
```

**Option C: Run as Administrator**
- Right-click PowerShell → "Run as Administrator"
- Run: `npm install -g truffle`

### Step 4: Clean and Reinstall

After fixing Visual Studio Build Tools and moving project:

```bash
# Navigate to project (outside OneDrive)
cd C:\Projects\Land_Register\Land-Registry-Application

# Clean everything
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Step 5: Ignore core-js Warning

The `core-js` warning is **harmless** - it's just a deprecation notice. Your installation will work fine. You can safely ignore it.

## Complete Command Sequence

```powershell
# 1. Move project outside OneDrive
mkdir C:\Projects
xcopy "C:\Users\Geetha\OneDrive\Documents\Land_Register\Land_Register" "C:\Projects\Land_Register" /E /I /H

# 2. Navigate to project
cd C:\Projects\Land_Register\Land-Registry-Application

# 3. Fix npm global directory
npm config set prefix "%APPDATA%\npm"

# 4. Clean and reinstall
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json

# 5. Install dependencies
npm install

# 6. Install truffle globally (or use npx)
npm install -g truffle

# 7. Verify truffle
npx truffle --version
```

## If Still Having Issues

### Check Visual Studio Build Tools Installation:
```bash
# Should show Visual Studio 2022
npm config get msvs_version
```

### Check Python:
```bash
python --version
# Should show: Python 3.12.x
```

### Check Node.js Version:
```bash
node --version
# Consider using Node.js v18 LTS or v20 LTS if v24 has issues
```

### Alternative: Skip Native Modules (Quick Workaround)
If you just need to get the app running:
```bash
npm install --ignore-scripts
```
⚠️ Note: This skips native module compilation. App will work but may be slower.

## Summary

1. ✅ **Install Visual Studio Build Tools 2022** (with C++ workload)
2. ✅ **Move project outside OneDrive** (to avoid file locking)
3. ✅ **Fix npm global directory** (for global installs)
4. ✅ **Clean and reinstall** (fresh start)
5. ✅ **Ignore core-js warning** (it's harmless)

---

**For detailed troubleshooting, see:** `INSTALLATION_TROUBLESHOOTING.md`

