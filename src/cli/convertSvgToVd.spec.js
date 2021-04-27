const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const convertSvgToVd = require('./convertSvgToVd');

describe('convertSvgToVd', () => {
  it('is deterministic', async () => {
    const targetPath1 = tempy.file({ extension: 'xml' });
    const targetPath2 = tempy.file({ extension: 'xml' });
    afterEach(async () => {
      await fs.remove(targetPath1);
      await fs.remove(targetPath2);
    });
    const sourcePath = path.join(__dirname, 'fixtures', 'react.svg');
    const size = [300, 267];
    await convertSvgToVd(sourcePath, targetPath1, size);
    await convertSvgToVd(sourcePath, targetPath2, size);
    const file1 = await fs.readFile(targetPath1);
    const file2 = await fs.readFile(targetPath2);
    expect(file1.equals(file2)).toBe(true);
  });
});
