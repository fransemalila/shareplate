#!/bin/bash

# Configuration
APP_NAME="SharePlate"
VERSION=$(node -p "require('./package.json').version")
BUILD_NUMBER=$(date +%Y%m%d%H%M)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "${YELLOW}Starting production build for $APP_NAME v$VERSION ($BUILD_NUMBER)${NC}"

# Clean up
echo "${YELLOW}Cleaning up previous builds...${NC}"
rm -rf android/app/build
rm -rf ios/build

# Install dependencies
echo "${YELLOW}Installing dependencies...${NC}"
npm install
cd ios && pod install && cd ..

# TypeScript check
echo "${YELLOW}Running TypeScript checks...${NC}"
npm run typecheck
if [ $? -ne 0 ]; then
    echo "${RED}TypeScript check failed${NC}"
    exit 1
fi

# Lint check
echo "${YELLOW}Running lint checks...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo "${RED}Lint check failed${NC}"
    exit 1
fi

# Run tests
echo "${YELLOW}Running tests...${NC}"
npm run test
if [ $? -ne 0 ]; then
    echo "${RED}Tests failed${NC}"
    exit 1
fi

# Android Build
echo "${YELLOW}Building Android release...${NC}"
cd android
./gradlew clean
./gradlew bundleRelease
if [ $? -ne 0 ]; then
    echo "${RED}Android build failed${NC}"
    exit 1
fi
cd ..

# iOS Build
echo "${YELLOW}Building iOS release...${NC}"
cd ios
xcodebuild clean archive -workspace $APP_NAME.xcworkspace -scheme $APP_NAME -archivePath build/$APP_NAME.xcarchive -configuration Release
if [ $? -ne 0 ]; then
    echo "${RED}iOS build failed${NC}"
    exit 1
fi

xcodebuild -exportArchive -archivePath build/$APP_NAME.xcarchive -exportPath build -exportOptionsPlist ExportOptions.plist
if [ $? -ne 0 ]; then
    echo "${RED}iOS export failed${NC}"
    exit 1
fi
cd ..

# Create build info file
echo "${YELLOW}Creating build info...${NC}"
echo "{
  \"version\": \"$VERSION\",
  \"buildNumber\": \"$BUILD_NUMBER\",
  \"buildDate\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
}" > build-info.json

echo "${GREEN}Build completed successfully!${NC}"
echo "${GREEN}Android bundle: android/app/build/outputs/bundle/release/app-release.aab${NC}"
echo "${GREEN}iOS IPA: ios/build/$APP_NAME.ipa${NC}" 