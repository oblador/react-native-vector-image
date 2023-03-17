const path = require('path');
const readSvgAsset = require('./readSvgAsset');

describe('readSvgAsset', () => {
  it('replaces fill="current" with supplied currentColor', () => {
    const svg = readSvgAsset(
      path.join(__dirname, 'fixtures', 'current-color.svg'),
      'red'
    );
    expect(svg).toContain('fill="red"');
  });
});
