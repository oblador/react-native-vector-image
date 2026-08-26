describe('getAssetByID', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('uses the React Native core asset registry when available', () => {
    const getAssetByIDFromCore = jest.fn(() => ({ name: 'core' }));
    jest.doMock('react-native', () => ({
      AssetRegistry: { getAssetByID: getAssetByIDFromCore },
    }));
    jest.doMock('@react-native/assets-registry/registry', () => {
      throw new Error('legacy registry should not be loaded');
    });

    const getAssetByID = require('./getAssetByID');

    expect(getAssetByID(42)).toEqual({ name: 'core' });
    expect(getAssetByIDFromCore).toHaveBeenCalledWith(42);
  });

  it('falls back to the standalone registry for older React Native versions', () => {
    const getAssetByIDFromStandalone = jest.fn(() => ({ name: 'standalone' }));
    jest.doMock('react-native', () => ({}));
    jest.doMock('@react-native/assets-registry/registry', () => ({
      getAssetByID: getAssetByIDFromStandalone,
    }));

    const getAssetByID = require('./getAssetByID');

    expect(getAssetByID(7)).toEqual({ name: 'standalone' });
    expect(getAssetByIDFromStandalone).toHaveBeenCalledWith(7);
  });

  it('throws a clear error when no asset registry is available', () => {
    jest.doMock('react-native', () => ({}));
    jest.doMock('@react-native/assets-registry/registry', () => {
      throw new Error('module not found');
    });

    const getAssetByID = require('./getAssetByID');

    expect(() => getAssetByID(1)).toThrow(
      'No asset registry found. Upgrade to React Native 0.87 or newer, or install @react-native/assets-registry.'
    );
  });
});
