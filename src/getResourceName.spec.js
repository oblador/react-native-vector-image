const getResourceName = require('./getResourceName');

describe('getResourceName', () => {
  it('replaces unsafe characters with _', () => {
    expect(
      getResourceName({ name: 'spaces and - dashes', hash: 'abc' })
    ).toEqual(expect.stringMatching(/^spaces_and_dashes/));
  });

  it('returns lower case string', () => {
    expect(getResourceName({ name: 'Snel Hest', hash: 'abc' })).toEqual(
      expect.stringMatching(/^snel_hest/)
    );
  });

  it('appends hash', () => {
    expect(getResourceName({ name: 'lol', hash: 'abc' })).toEqual(
      expect.stringMatching(/_abc$/)
    );
  });

  it('has the pattern of name_svg_hash', () => {
    expect(getResourceName({ name: 'lol', hash: 'abc' })).toBe('lol_svg_abc');
  });
});
