const fs = require('fs');

const readSvgAsset = (path, currentColor) =>
  fs
    .readFileSync(path)
    .toString()
    .replace(
      /\s(fill|stroke|stop-color|flood-color|lighting-color)=["']currentColor["']/g,
      (_, attribute) => ` ${attribute}="${currentColor}"`
    );

module.exports = readSvgAsset;
