#!/usr/bin/env bash -e

# This script removes .svg files generated by metro.
# For use in Xcode.

RN_ASSETS_PATH="$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH/assets"

if [ -d "$RN_ASSETS_PATH" ]; then
  find $RN_ASSETS_PATH -type f -name "*.svg" -delete 
fi
