const Server = require('metro/src/Server');
const { loadConfig } = require('metro-config');
const output = require('metro/src/shared/output/bundle');

const getBabelTransformerPath = () => {
  try {
    // for RN 73+
    return require.resolve('@react-native/metro-babel-transformer');
  } catch (e) {
    // to ensure backwards compatibility with old RN versions (RN < 73)
    return require.resolve('metro-react-native-babel-transformer');
  }
}

async function getAssets(options) {
  const args = {
    entryFile: options.entryFile,
    dev: false,
    minify: false,
    platform: 'ios',
  };

  const config = await loadConfig(
    {
      cwd: process.cwd(),
      config: options.config,
      resetCache: options.resetCache,
    },
    {
      resolver: {
        resolverMainFields: ['react-native', 'browser', 'main'],
      },
      transformer: {
        allowOptionalDependencies: true,
        babelTransformerPath: getBabelTransformerPath(),
        assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
      },
    }
  );

  process.env.NODE_ENV = 'production';

  const requestOpts = {
    entryFile: args.entryFile,
    dev: args.dev,
    minify: false,
    platform: args.platform,
    unstable_transformProfile: args.unstableTransformProfile,
  };
  const server = new Server(config);

  try {
    await output.build(server, requestOpts);

    return await server.getAssets({
      ...Server.DEFAULT_BUNDLE_OPTIONS,
      ...requestOpts,
      bundleType: 'todo',
    });
  } finally {
    server.end();
  }
}

module.exports = getAssets;
