const server = require('metro/private/Server');
const { loadConfig } = require('metro-config');
const output = require('metro/private/shared/output/bundle');

const Server = server.Server || server.default || server;
const getBabelTransformerPath = () => {
  try {
    // for RN 73+
    return require.resolve('@react-native/metro-babel-transformer');
  } catch (e) {
    // to ensure backwards compatibility with old RN versions (RN < 73)
    return require.resolve('metro-react-native-babel-transformer');
  }
};

async function createMetroServerAndBundleRequest(
  options,
  bundleWithExpo = false
) {
  const args = {
    entryFile: options.entryFile,
    dev: false,
    minify: false,
    platform: 'ios',
  };

  if (bundleWithExpo) {
    let createMetroServerAndBundleRequestAsync = null;
    try {
      createMetroServerAndBundleRequestAsync = require('expo/node_modules/@expo/cli/build/src/export/embed/exportEmbedAsync')
        .createMetroServerAndBundleRequestAsync;
    } catch {
      createMetroServerAndBundleRequestAsync = require('@expo/cli/build/src/export/embed/exportEmbedAsync')
        .createMetroServerAndBundleRequestAsync;
    }
    return await createMetroServerAndBundleRequestAsync(process.cwd(), {
      ...args,
      ...options,
    });
  }

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

  const bundleRequest = {
    entryFile: args.entryFile,
    dev: args.dev,
    minify: false,
    platform: args.platform,
    unstable_transformProfile: args.unstableTransformProfile,
  };
  const server = new Server(config);

  return { server, bundleRequest };
}

async function getAssets(options, bundleWithExpo) {
  const { server, bundleRequest } = await createMetroServerAndBundleRequest(
    options,
    bundleWithExpo
  );

  try {
    await output.build(server, bundleRequest);

    return await server.getAssets({
      ...Server.DEFAULT_BUNDLE_OPTIONS,
      ...bundleRequest,
      bundleType: 'todo',
    });
  } finally {
    server.end();
  }
}

module.exports = getAssets;
