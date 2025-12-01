# 🏠 Local Build Guide - Build APK/AAB on Your System

## Why Build Locally?

✅ **Advantages:**
- No EAS account needed
- Faster builds (runs on your machine)
- Full control over build process
- No build minutes limit
- Works offline
- Free forever

❌ **EAS Cloud Advantages:**
- No local setup needed
- Works on any OS
- Managed credentials
- Build queue management
- Easier for teams

---

## 🚀 Quick Start - Local Builds

### Prerequisites

You need:
1. **Android Studio** (for Android SDK)
2. **Java JDK 17** (for Gradle)
3. **Node.js 18+** (already have it)

---

## 📱 Setup Instructions

### Step 1: Install Android Studio

#### Linux (Ubuntu/Debian):
```bash
# Download Android Studio
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.1.1.28/android-studio-2023.1.1.28-linux.tar.gz

# Extract
sudo tar -xzf android-studio-*-linux.tar.gz -C /opt/

# Run Android Studio
/opt/android-studio/bin/studio.sh
```

#### During Android Studio Setup:
1. Install Android SDK
2. Install Android SDK Platform 34 (or latest)
3. Install Android SDK Build-Tools
4. Install Android Emulator (optional)

### Step 2: Set Environment Variables

Add to `~/.zshrc`:
```bash
# Android
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Java (if needed)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin
```

Then reload:
```bash
source ~/.zshrc
```

### Step 3: Verify Installation
```bash
# Check Android SDK
echo $ANDROID_HOME

# Check adb
adb version

# Check Java
java -version
```

---

## 🔨 Building APK/AAB Locally

### Method 1: Pure Gradle (Fastest)

#### First Time Setup:
```bash
# Generate native Android project
pnpm run prebuild
```

This creates the `android/` folder with native code.

#### Build APK:
```bash
# Debug APK (for testing)
pnpm run build:local:debug

# Release APK (for distribution)
pnpm run build:local:apk
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

#### Build AAB:
```bash
pnpm run build:local:aab
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

### Method 2: EAS Local Build

This uses EAS but builds on your machine (hybrid approach):

```bash
# Build APK locally
pnpm run build:android:apk

# Build AAB locally
pnpm run build:android:aab
```

Benefits:
- Uses EAS configuration
- Builds on your machine
- Managed credentials
- Consistent with cloud builds

---

## 🔐 Signing Your App

### Generate Keystore (One-Time)

```bash
# Create keystore directory
mkdir -p android/app/keystore

# Generate keystore
keytool -genkey -v -keystore android/app/keystore/release.keystore \
  -alias my-app-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Remember your password!
```

### Configure Signing

Create `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=keystore/release.keystore
MYAPP_RELEASE_KEY_ALIAS=my-app-key
MYAPP_RELEASE_STORE_PASSWORD=your_keystore_password
MYAPP_RELEASE_KEY_PASSWORD=your_key_password
```

Update `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 📦 Complete Build Workflow

### Development Build (Testing):
```bash
# 1. Generate native project
pnpm run prebuild

# 2. Build debug APK
pnpm run build:local:debug

# 3. Install on device
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Production Build (Release):
```bash
# 1. Update version in app.json
# "version": "1.0.1"

# 2. Prebuild (if needed)
pnpm run prebuild

# 3. Build release APK
pnpm run build:local:apk

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Play Store Build:
```bash
# 1. Build AAB
pnpm run build:local:aab

# 2. Find file
# android/app/build/outputs/bundle/release/app-release.aab

# 3. Upload to Play Console
# https://play.google.com/console
```

---

## 🎯 When to Use Each Method

### Use **Pure Local Builds** when:
- You have Android Studio installed
- Building frequently
- Testing on device often
- Want full control
- Don't want EAS dependency

### Use **EAS Local Builds** when:
- Want EAS features (credentials, profiles)
- Building on your machine but want EAS consistency
- Team uses EAS cloud

### Use **EAS Cloud Builds** when:
- No Android Studio setup
- Building from CI/CD
- Team collaboration
- Don't want to maintain local environment

---

## 🔄 Updates Without Rebuilding

You can still use Expo Updates for OTA updates even with local builds!

### Setup:
1. Keep expo-updates installed ✅ (already done)
2. Configure update URL in app.json ✅ (already done)
3. Publish updates:

```bash
# Publish OTA update
npx expo-updates --platform android

# Users get update without new APK!
```

---

## 🛠️ Troubleshooting

### "Android SDK not found"
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
source ~/.zshrc
```

### "Java version mismatch"
```bash
# Install Java 17
sudo apt install openjdk-17-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### "Gradle build failed"
```bash
# Clean gradle cache
cd android
./gradlew clean
cd ..

# Rebuild
pnpm run prebuild
pnpm run build:local:apk
```

### "App not signed"
Make sure you created and configured keystore (see Signing section above)

---

## 📊 Build Size Comparison

| Build Type | Size | Use Case |
|-----------|------|----------|
| Debug APK | ~50MB | Development/Testing |
| Release APK | ~25MB | Distribution/Sideload |
| Release AAB | ~20MB | Play Store (generates optimized APKs) |

---

## ⚡ Quick Commands Reference

```bash
# Setup
pnpm run prebuild                 # Generate native project

# Debug
pnpm run build:local:debug        # Fast debug build
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Release
pnpm run build:local:apk          # Production APK
pnpm run build:local:aab          # Play Store AAB

# EAS Local
pnpm run build:android:apk        # EAS local APK
pnpm run build:android:aab        # EAS local AAB

# Check device
adb devices                       # List connected devices

# Install
adb install path/to/app.apk      # Install on device

# Clean
cd android && ./gradlew clean && cd ..
rm -rf android ios                # Remove native folders
```

---

## 🎯 Recommended Workflow

### For Solo Developer (You):
```bash
# 1. Build locally for speed
pnpm run prebuild
pnpm run build:local:apk

# 2. Test on device
adb install android/app/build/outputs/apk/release/app-release.apk

# 3. Push OTA updates for quick fixes
npx expo-updates --platform android

# 4. Upload AAB to Play Store when ready
pnpm run build:local:aab
```

### Benefits:
- ✅ No EAS account needed
- ✅ Fast local builds
- ✅ Still get OTA updates
- ✅ Full control
- ✅ Free forever

---

## 📝 Summary

You have THREE options:

1. **Pure Local (Gradle)** - Fastest, most control
   - `pnpm run build:local:apk`
   - Requires Android Studio

2. **EAS Local** - Hybrid approach
   - `pnpm run build:android:apk`
   - EAS features + local speed

3. **EAS Cloud** - Easiest setup
   - Remove `--local` flag
   - Builds on Expo servers

**Recommendation:** Use **Pure Local** for development and testing, then switch to **EAS Cloud** only if you need team features or building from CI/CD.

You can build completely locally - no EAS servers required! 🎉
