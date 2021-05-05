#!/bin/bash -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
BIN_DIR="$DIR/../bin"
CHECKOUT_DIR="$TMPDIR/svg2vd-build"
GRADLE_CONFIG="$CHECKOUT_DIR/build.gradle.kts"
SDK_VERSION="27.1.3"

rm -rf $CHECKOUT_DIR || true
mkdir -p $CHECKOUT_DIR

git clone git@github.com:Shopify/svg2vd.git $CHECKOUT_DIR
cd $CHECKOUT_DIR

# Apply a newer version of the SDK that works better
sed -i '' "s/common:26.3.2/common:$SDK_VERSION/" "$GRADLE_CONFIG"
./gradlew jar
mv build/libs/svg2vd-0.1.jar $BIN_DIR
rm -rf $CHECKOUT_DIR
