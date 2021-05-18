const convertSvgToVd = require('./convertSvgToVd');
const { reactLogo, rectangle, dropShadow } = require('./fixtures');
const { readStream } = require('./streams');

const convert = (fixture) => readStream(convertSvgToVd(fixture));

describe('convertSvgToVd', () => {
  it('is deterministic', async () => {
    const file1 = await convert(reactLogo);
    const file2 = await convert(reactLogo);
    expect(file1.equals(file2)).toBe(true);
  });

  it('supports rgba colors', async () => {
    const result = (await convert(rectangle)).toString();
    expect(result).toEqual(
      expect.stringContaining('android:fillColor="#d8d8d880"')
    );
    expect(result).toEqual(
      expect.stringContaining('android:strokeColor="#979797"')
    );
  });

  it('throws for non-svg files', async () => {
    await expect(convert('garbage')).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Not a proper SVG file"`
    );
  });

  it('throws for unsupported elements like feGaussianBlur', async () => {
    await expect(
      convert(dropShadow)
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"line 4: <filter> is not supported; line 5: <feOffset> is not supported; line 6: <feGaussianBlur> is not supported; line 7: <feComposite> is not supported; line 8: <feColorMatrix> is not supported"`
    );
  });
});
