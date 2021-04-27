const fs = require('fs-extra');
const path = require('path');
const tempy = require('tempy');
const convertSvgToPdf = require('./convertSvgToPdf');

describe('convertSvgToPdf', () => {
  it('is deterministic', async () => {
    const targetPath1 = tempy.file({ extension: 'pdf' });
    const targetPath2 = tempy.file({ extension: 'pdf' });
    afterEach(async () => {
      await fs.remove(targetPath1);
      await fs.remove(targetPath2);
    });
    const sourcePath = path.join(__dirname, 'fixtures', 'react.svg');
    const size = [300, 267];
    await convertSvgToPdf(sourcePath, targetPath1, size);
    await convertSvgToPdf(sourcePath, targetPath2, size);
    const file1 = await fs.readFile(targetPath1);
    const file2 = await fs.readFile(targetPath2);
    expect(file1.equals(file2)).toBe(true);
  });
});
