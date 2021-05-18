const path = require('path');
const convertSvgToPdf = require('./convertSvgToPdf');
const { reactLogo } = require('./fixtures');
const { readStream } = require('./streams');

const convert = (fixture, size) => readStream(convertSvgToPdf(fixture, size));

describe('convertSvgToPdf', () => {
  it('is deterministic', async () => {
    const size = [300, 267];
    const file1 = await convert(reactLogo, size);
    const file2 = await convert(reactLogo, size);
    expect(file1.equals(file2)).toBe(true);
  });
});
