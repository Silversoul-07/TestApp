# 🚀 Quick Start Guide - Updates & Releases

## ✅ What's Already Done

Your app now has:
- ✅ In-app update checking (Settings screen)
- ✅ OTA update capability
- ✅ EAS build configuration (APK/AAB)
- ✅ GitHub Actions workflow
- ✅ Automatic version management

## 🎯 Next Steps (5 Minutes Setup)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```
Don't have an account? Create free: https://expo.dev/signup

### 3. Initialize Your Project
```bash
eas init
```
This will give you a **Project ID**

### 4. Update app.json
Open `app.json` and replace `YOUR_PROJECT_ID` with your actual project ID in:
- Line 46: `"url": "https://u.expo.dev/YOUR_PROJECT_ID"`
- Line 53: `"projectId": "YOUR_PROJECT_ID"`

### 5. Test Your Setup
```bash
# Check if everything is configured
eas build:configure

# Build a preview APK (optional, takes 10-15 min)
pnpm run build:preview
```

---

## 📱 How to Build & Release

### Build APK (Sideload/Test)
```bash
pnpm run build:android:apk
```
- Get installable APK file
- Share with testers
- No Play Store needed

### Build AAB (Play Store)
```bash
pnpm run build:android:aab
```
- Required for Google Play
- Upload to Play Console
- First time: https://play.google.com/console ($25 fee)

### Publish Updates (No New Build!)
```bash
pnpm run update:production "Fixed bugs"
```
- Users get update instantly
- No app store approval needed
- Works for JS/UI changes only

---

## 🤖 GitHub Auto-Deploy (Optional)

### Setup (One-Time)
1. Get Expo token:
   ```bash
   eas whoami
   eas build:configure
   ```

2. Add to GitHub Secrets:
   - Go to: GitHub Repo → Settings → Secrets → Actions
   - Add secret: `EXPO_TOKEN`
   - Value: Your token from `eas whoami`

3. How it works:
   - **Push to main** → Automatic OTA update
   - **Create tag (v1.0.1)** → Automatic build
   - **Manual trigger** → Choose platform/profile

---

## 🎮 User Experience

### When You Push Update:
1. You run: `pnpm run update:production "New features"`
2. Update publishes to Expo servers
3. User opens app → Automatically checks for updates
4. User sees "Update Available" in Settings
5. User clicks "Check for Updates"
6. Downloads and restarts → New version!

### In App:
- Settings → Shows version (v1.0.0)
- Settings → "Check for Updates" button
- Automatic check on app launch
- Update badge when available

---

## 📊 Monitoring

### Check Builds
```bash
eas build:list
```
See all your builds and download links

### Check Updates
```bash
eas update:list --branch production
```
See published updates and analytics

### Dashboard
Visit: https://expo.dev
- Build history
- Update downloads
- Crash reports

---

## 🎯 Common Commands

```bash
# Development
pnpm dev                          # Start dev server

# Building
pnpm run build:preview            # Test build (APK)
pnpm run build:android:apk        # Production APK
pnpm run build:android:aab        # Play Store AAB

# Updates
pnpm run update:production "msg"  # Push live update
pnpm run update:preview "msg"     # Test update

# Checking
eas build:list                    # View builds
eas update:list --branch production  # View updates

# Submit
pnpm run submit:android           # Auto-submit to Play Store
```

---

## ⚡ Quick Workflow Examples

### Fix a Bug
```bash
# 1. Fix code
# 2. Test locally
pnpm dev

# 3. Commit
git add .
git commit -m "Fix: Calendar display issue"
git push

# 4. Push update (users get it instantly!)
pnpm run update:production "Fixed calendar bug"
```

### Add New Feature
```bash
# 1. Build feature
# 2. Test
# 3. Commit & push
git push

# 4. Push to preview first
pnpm run update:preview "Testing new stats"

# 5. After testing, push to production
pnpm run update:production "New statistics dashboard"
```

### Release New Version (with native changes)
```bash
# 1. Update version in app.json
"version": "1.1.0"

# 2. Commit
git add .
git commit -m "Release v1.1.0"
git tag v1.1.0
git push --tags

# 3. Build (auto via GitHub Actions or manual)
pnpm run build:android:aab

# 4. Submit to Play Store
pnpm run submit:android
```

---

## 🆘 Troubleshooting

### "Project not configured"
```bash
eas init
```

### "Not logged in"
```bash
eas login
```

### Build fails
```bash
eas build --platform android --clear-cache
```

### Updates not working
- Check: Not in dev mode
- Check: Project ID in app.json
- Check: `eas update:list --branch production`

---

## 📚 Full Documentation

See `docs/updates-and-releases.md` for:
- Detailed setup instructions
- Play Store submission guide
- Best practices
- Advanced workflows

---

## ✨ That's It!

Your app can now:
- 🔄 Update itself automatically
- 📱 Build APK/AAB for distribution
- 🚀 Deploy updates instantly
- 🤖 Automate via GitHub

**Next:** Run `eas init` and start building! 🎉
