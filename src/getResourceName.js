function getResourceName(asset) {
  return `${asset.name
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')}_svg_${asset.hash.substr(0, 6)}`;
}

module.exports = getResourceName;
