# SharePlate Mobile App Deployment Guide

## Prerequisites

Before deploying the SharePlate mobile app, ensure you have the following:

### General Requirements
- Node.js 18 or higher
- npm 8 or higher
- Ruby 3.0 or higher
- Fastlane installed (`gem install fastlane`)
- Access to the project's GitHub repository

### iOS Requirements
- Xcode 14 or higher
- Apple Developer Account with App Store Connect access
- Certificates and provisioning profiles set up
- CocoaPods installed (`gem install cocoapods`)

### Android Requirements
- Android Studio
- JDK 11 or higher
- Google Play Console access
- Keystore file for app signing
- Google Play JSON key file for API access

## Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/shareplate.git
   cd shareplate/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   cd ios && pod install && cd ..
   ```

3. Set up environment variables:
   ```bash
   # iOS
   export MATCH_PASSWORD="your-match-password"
   export FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="your-app-specific-password"
   
   # Android
   export GOOGLE_PLAY_JSON_KEY="path-to-your-json-key"
   ```

## Manual Deployment

### iOS Deployment

1. Build for TestFlight:
   ```bash
   fastlane ios beta
   ```

2. Build for App Store:
   ```bash
   fastlane ios release
   ```

### Android Deployment

1. Build for Play Store Beta:
   ```bash
   fastlane android beta
   ```

2. Build for Play Store Release:
   ```bash
   fastlane android release
   ```

## Automated Deployment (CI/CD)

The project uses GitHub Actions for automated deployment:

1. Push to main branch triggers the CI/CD pipeline
2. Tests are run automatically
3. If tests pass:
   - Android app is built and deployed to Play Store Beta
   - iOS app is built and deployed to TestFlight

### Required Secrets

Set up the following secrets in GitHub:

- `MATCH_PASSWORD`
- `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD`
- `GOOGLE_PLAY_JSON_KEY`

## Version Management

- iOS: Version numbers are automatically incremented by Fastlane
- Android: Version code and name are automatically incremented by Fastlane

## Troubleshooting

### Common Issues

1. iOS build fails:
   - Check certificates and provisioning profiles
   - Verify Apple Developer account access
   - Ensure Xcode version is compatible

2. Android build fails:
   - Verify keystore file presence and validity
   - Check Google Play Console API access
   - Ensure correct JDK version

### Support

For deployment issues:
1. Check the CI/CD logs in GitHub Actions
2. Review Fastlane logs
3. Contact the DevOps team 