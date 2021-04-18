const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs/yargs');
const generateAssets = require('./generateAssets');

const detectReactNativeAppName = () => {
  try {
    const config = fs.readJsonSync(path.resolve('app.json'));
    if (config && config.name) {
      return config.name;
    }
  } catch {}
  return 'YourApp';
};

function main(argv) {
  const options = yargs(argv)
    .command(
      'generate',
      'generate native vector assets',
      {
        'entry-file': {
          description: 'Path to the app entrypoint file',
          default: 'index.js',
          demandOption: true,
          type: 'string',
        },
        config: {
          description: 'Path to the metro config file',
          type: 'string',
        },
        'reset-cache': {
          description: 'Reset metro cache before extracting SVG assets',
          default: false,
          type: 'boolean',
        },
        'ios-output': {
          description: 'Path to an iOS `.xcassets` folder',
          default: `ios/${detectReactNativeAppName()}/Images.xcassets`,
        },
        'android-output': {
          description: 'Path to an Android `res` folder',
          default: 'android/app/src/main/res',
        },
      },
      async (options) => {
        try {
          if (options.iosOutput && !fs.existsSync(options.iosOutput)) {
            throw new Error(
              "Invalid --ios-output argument, folder doesn't exist"
            );
          }
          if (options.androidOutput && !fs.existsSync(options.androidOutput)) {
            throw new Error(
              "Invalid --android-output argument, folder doesn't exist"
            );
          }
          if (!options.iosOutput && !options.androidOutput) {
            throw new Error('At least one output option must be passed');
          }
          await generateAssets(options);
        } catch (error) {
          console.warn(error.message);
          console.info(error.stack);
          console.error('Failed to generate vector assets');
        }
      }
    )
    .strict()
    .help().argv;
}

module.exports = main;
