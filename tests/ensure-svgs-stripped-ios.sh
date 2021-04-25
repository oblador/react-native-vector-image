#!/usr/bin/env bash -e

OUTPUT_PATH=`mktemp -d -t 'rnvi-build-'`

xcodebuild clean build \
  -quiet \
  -workspace Example/ios/Example.xcworkspace \
  -scheme Example \
  -configuration Release \
  -derivedDataPath $OUTPUT_PATH \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO \
  CODE_SIGN_ENTITLEMENTS="" \
  CODE_SIGNING_ALLOWED=NO

ASSETS_PATH="$OUTPUT_PATH/Build/Products/Release-iphoneos/Example.app/assets"

if [ ! -d "$ASSETS_PATH" ]; then
  echo "Assets folder not found!"
  exit 1
fi

if [ -f "$ASSETS_PATH/react.svg" ]; then
  echo "react.svg not stripped!"
  exit 1
fi
