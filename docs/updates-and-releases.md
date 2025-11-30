# In-App Updates & Android Release Setup Guide

## 🚀 Overview
This app now supports automatic OTA (Over-The-Air) updates using Expo Updates and can build APK/AAB files for distribution.

## 📦 What's Configured

### 1. **Expo Updates** (In-App Updates)
- ✅ Automatic update checking on app launch
- ✅ Manual update check in Settings
- ✅ Update download with progress
- ✅ App restart after update

### 2. **EAS Build** (APK/AAB Generation)
- ✅ Development builds (APK)
- ✅ Preview builds (APK) for testing
- ✅ Production builds (APK/AAB)
- ✅ Auto-increment version codes

### 3. **Settings Screen**
- ✅ App version display
- ✅ Build ID display
- ✅ "Check for Updates" button
- ✅ Update available indicator

---

## 🔧 Setup Instructions

### Step 1: Install EAS CLI Globally
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo Account
```bash
eas login
```
If you don't have an account, create one at: https://expo.dev/signup

### Step 3: Configure Your Project
```bash
eas init
```
This will:
- Create a project on Expo servers
- Generate a project ID
- Link it to your local app

After running this, **update your `app.json`**:
- Replace `YOUR_PROJECT_ID` with the actual project ID from EAS

### Step 4: Configure Android Keystore (For Production)
```bash
eas credentials
```
Choose:
1. Android
2. Production
3. "Set up a new keystore"

This creates a signing key for your app releases.

---

## 📱 Building APK/AAB

### Build Development APK (Testing)
```bash
pnpm run build:preview
```
- Creates installable APK for testing
- No Play Store required
- Can share via file or link

### Build Production APK
```bash
pnpm run build:android:apk
```
- Optimized for sideloading
- Can distribute outside Play Store

### Build Production AAB (Play Store)
```bash
pnpm run build:android:aab
```
- Required format for Google Play Store
- Optimized size
- Play Store handles APK generation

### Check Build Status
```bash
eas build:list
```

### Download Build
After build completes, you'll get:
1. Download link (valid for 30 days)
2. QR code for easy mobile download
3. Option to download via dashboard: https://expo.dev

---

## 🔄 Publishing Updates (OTA)

### How It Works
1. You publish JavaScript/assets updates
2. Users get updates WITHOUT downloading new APK/AAB
3. Updates happen on next app launch
4. Only works for code changes (not native dependencies)

### Publish Update to Production
```bash
pnpm run update:production "Bug fixes and improvements"
```

### Publish Update to Preview
```bash
pnpm run update:preview "Testing new features"
```

### What Can Be Updated OTA?
✅ JavaScript code changes
✅ UI/UX updates
✅ Bug fixes
✅ New screens/features (JS only)
✅ Images and assets

❌ Native dependency changes (require new build)
❌ app.json configuration changes
❌ Plugin additions

---

## 🎯 Complete Workflow

### Initial Release
```bash
# 1. Build production AAB for Play Store
pnpm run build:android:aab

# 2. Wait for build to complete
eas build:list

# 3. Download AAB file
# Visit https://expo.dev/accounts/YOUR_ACCOUNT/projects/YOUR_PROJECT/builds

# 4. Upload to Google Play Console
# https://play.google.com/console
```

### Releasing Updates (No New Build Needed)
```bash
# 1. Make code changes
git add .
git commit -m "Fix: Resolved calendar issue"

# 2. Publish OTA update
pnpm run update:production "Fixed calendar display bug"

# 3. Users get update on next app launch automatically
```

### Releasing New Version (Native Changes)
```bash
# 1. Update version in app.json
# Change "version": "1.0.0" to "1.0.1"

# 2. Build new APK/AAB
pnpm run build:android:aab

# 3. Submit to Play Store
pnpm run submit:android
```

---

## 📋 Update Channels

Your app has 3 update channels configured:

1. **Development**: `eas update --branch development`
   - For testing during development
   - Use with development builds

2. **Preview**: `eas update --branch preview`
   - For internal testing
   - Use with preview builds

3. **Production**: `eas update --branch production`
   - For end users
   - Use with production builds

Users on production builds only receive production updates.

---

## 🎮 User Experience

### When Updates Are Available:
1. **Automatic Check**: On app launch (silent)
2. **Manual Check**: Settings → "Check for Updates" button
3. **Download**: User confirms → Download starts
4. **Apply**: App restarts automatically

### Settings Screen Features:
- Shows current app version (e.g., v1.0.0)
- Shows build ID (unique identifier)
- "Check for Updates" button
- "Update Available" badge when new version found
- Loading indicator during check/download

---

## 🔐 Google Play Store Submission

### First-Time Setup
1. Create developer account: https://play.google.com/console
   - One-time fee: $25 USD

2. Create new app in Console:
   - App name: "Media Tracker"
   - Default language: English
   - Free or Paid: Free

3. Fill required information:
   - Privacy Policy URL
   - App category: Entertainment
   - Content rating questionnaire
   - Target audience

4. Upload AAB file to Internal Testing track first

### Submit Update
```bash
# Auto-submit to Internal Testing
pnpm run submit:android
```

Or manually:
1. Go to Play Console
2. Select your app
3. Production → Create new release
4. Upload AAB file
5. Add release notes
6. Review and rollout

---

## 🛠️ Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
eas build --platform android --clear-cache
```

### Updates Not Working
1. Check you're not in development mode (`__DEV__` is false)
2. Verify `runtimeVersion` matches in app.json
3. Check update channel matches build profile
4. Run: `eas update:list --branch production`

### Can't Login to EAS
```bash
eas logout
eas login
```

### Check Update Configuration
```bash
eas update:configure
```

---

## 📊 Monitoring

### View All Builds
```bash
eas build:list
```

### View All Updates
```bash
eas update:list --branch production
```

### Build Analytics
Visit: https://expo.dev/accounts/YOUR_ACCOUNT/projects/YOUR_PROJECT
- Build history
- Update downloads
- Crash reports
- User analytics

---

## 💡 Best Practices

### Version Numbering
- **Major.Minor.Patch** (e.g., 1.2.3)
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Update Frequency
- **OTA Updates**: Weekly or as needed
- **Store Builds**: Monthly or when adding native dependencies

### Testing Workflow
1. Test locally: `pnpm dev`
2. Build preview: `pnpm run build:preview`
3. Test on device
4. Push OTA to preview channel
5. Test with preview testers
6. Promote to production: `pnpm run update:production`

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-stats

# Commit changes
git commit -m "Add: New statistics dashboard"

# Merge to main
git checkout main
git merge feature/new-stats

# Push to GitHub
git push origin main

# Publish update
pnpm run update:production "New statistics dashboard"
```

---

## 📱 Install on Device

### Via Link (After Build)
1. Build completes → EAS provides install URL
2. Open URL on Android device
3. Download and install APK
4. Allow "Install from Unknown Sources" if prompted

### Via File
1. Download APK from EAS dashboard
2. Transfer to device (USB/Cloud)
3. Open file on device
4. Install

### Via QR Code
1. Scan QR from build output
2. Downloads APK automatically
3. Install on device

---

## 🎉 Summary

Your app now has:
- ✅ In-app update checking
- ✅ OTA updates (no store required for code changes)
- ✅ APK builds (for sideloading)
- ✅ AAB builds (for Play Store)
- ✅ Automatic version management
- ✅ Update UI in Settings
- ✅ Professional release workflow

## 📚 Resources
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- EAS Update Docs: https://docs.expo.dev/eas-update/introduction/
- Play Console: https://play.google.com/console
- Expo Dashboard: https://expo.dev

---

## 🚀 Quick Commands Reference

```bash
# Setup
eas login
eas init

# Builds
pnpm run build:preview          # Test APK
pnpm run build:android:apk      # Production APK
pnpm run build:android:aab      # Play Store AAB

# Updates
pnpm run update:production "Message"
pnpm run update:preview "Message"

# Submit
pnpm run submit:android         # Auto-submit to Play Store

# Monitor
eas build:list
eas update:list --branch production
```

Now your app can receive updates instantly without going through app stores! 🎊
