# CamLocation

A React Native mobile application that allows users to capture photos with embedded GPS location data and manage them with location information.

## Features

- **Camera with GPS Integration**: Take photos with automatic GPS location tagging
- **Location-Aware Photography**: Capture and view photos with precise location metadata
- **Media Library Integration**: Save and manage photos in your device's gallery
- **Image Manipulation**: Edit and process images with location data
- **Maps Integration**: View photo locations on interactive maps
- **Cross-Platform**: Runs on both Android and iOS

## Tech Stack

- **Framework**: React Native 0.81.5
- **Platform**: Expo SDK ~54.0.30
- **Navigation**: Expo Router ~6.0.21
- **UI Library**: React Native with Expo components
- **Maps**: React Native Maps 1.20.1
- **Language**: TypeScript 5.9.2

### Key Dependencies

- **Camera**: expo-camera, expo-image-picker
- **Location**: expo-location
- **Media**: expo-media-library, expo-image, expo-image-manipulator
- **Storage**: @react-native-async-storage/async-storage
- **Animations**: react-native-reanimated, react-native-gesture-handler

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm** or **yarn**
- **Java Development Kit (JDK) 17**: Required for Android builds
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Java Setup (macOS)

```bash
# Install JDK 17 using Homebrew
brew install openjdk@17

# Add to your ~/.zshrc or ~/.bashrc
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repository-url>
   cd CamLocation
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the App

### Development Mode

**Start the Expo development server**:
```bash
npm start
```

**Run on Android emulator**:
```bash
npm run android
```

**Run on iOS simulator** (macOS only):
```bash
npm run ios
```

**Run on web**:
```bash
npm run web
```

### Using Expo Go

1. Install Expo Go on your physical device
2. Run `npm start`
3. Scan the QR code with Expo Go app

## Building for Production

This project uses **EAS (Expo Application Services)** for building production apps.

### Prerequisites for EAS Build

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

### Build Commands

#### Android

**Production APK** (for direct installation/sideloading):
```bash
npx eas build --profile production-apk --platform android
```

**Production AAB** (for Google Play Store):
```bash
npx eas build --profile production --platform android
```

**Preview/Testing APK**:
```bash
npx eas build --profile preview --platform android
```

**Development Build**:
```bash
npx eas build --profile development --platform android
```

#### iOS

**Production Build** (for App Store):
```bash
npx eas build --profile production --platform ios
```

### Local Android Build

To build APK locally:
```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## Project Structure

```
CamLocation/
├── app/                    # App screens and routes (Expo Router)
├── assets/                 # Images, fonts, and static assets
├── components/             # Reusable React components
├── constants/              # App constants and configuration
├── hooks/                  # Custom React hooks
├── plugins/                # Expo config plugins
├── scripts/                # Build and utility scripts
├── android/                # Android native code
├── ios/                    # iOS native code
├── app.json               # Expo app configuration
├── eas.json               # EAS build configuration
└── package.json           # Dependencies and scripts
```

## Permissions

The app requires the following permissions:

### Android
- `ACCESS_COARSE_LOCATION` - Approximate location
- `ACCESS_FINE_LOCATION` - Precise location
- `CAMERA` - Camera access
- `READ_MEDIA_IMAGES` - Read images from storage
- `READ_MEDIA_VIDEO` - Read videos from storage
- `ACCESS_MEDIA_LOCATION` - Access media location metadata

### iOS
- Camera Permission
- Location Permission (Always and When In Use)
- Photo Library Permission

## Configuration

### App Configuration (`app.json`)
- **Bundle ID (iOS)**: `com.anonymous.CamLocation`
- **Package Name (Android)**: `com.anonymous.CamLocation`
- **Version**: 1.0.0

### Build Profiles (`eas.json`)
- **development**: Development build with dev client
- **preview**: Internal testing APK
- **production**: Play Store AAB
- **production-apk**: Production APK for sideloading

## Publishing to App Stores

### Google Play Store

1. Build production AAB:
   ```bash
   npx eas build --profile production --platform android
   ```

2. Go to [Google Play Console](https://play.google.com/console)
3. Create a new app or select existing
4. Upload the `.aab` file under Release → Production
5. Complete store listing, screenshots, and descriptions
6. Submit for review

### Apple App Store

1. Build production IPA:
   ```bash
   npx eas build --profile production --platform ios
   ```

2. Use EAS Submit or manually upload to App Store Connect
3. Complete app information and screenshots
4. Submit for review

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run reset-project` - Reset project to initial state
- `npm run lint` - Run ESLint

## Troubleshooting

### Android Build Issues

**Java not found**:
```bash
# Make sure JAVA_HOME is set
echo $JAVA_HOME

# If empty, add to ~/.zshrc:
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"
```

**CMake/NDK errors on Apple Silicon**:
```bash
# Install native CMake and Ninja
brew install cmake ninja
```

**Clear build cache**:
```bash
cd android
./gradlew clean
cd ..
```

### iOS Build Issues

**Pod install fails**:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

## Learn More

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the Community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact:
- Email: aravinthanjai@gmail.com
