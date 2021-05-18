const fs = require('fs-extra');
const path = require('path');
const yargs = require('yargs/yargs');
const chalk = require('chalk');
const generateAssets = require('./generateAssets');
const { VectorImageError, ArgumentError } = require('./errors');

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
            throw new ArgumentError(
              "Invalid --ios-output argument, folder doesn't exist"
            );
          }
          if (options.androidOutput && !fs.existsSync(options.androidOutput)) {
            throw new ArgumentError(
              "Invalid --android-output argument, folder doesn't exist"
            );
          }
          if (!options.iosOutput && !options.androidOutput) {
            throw new ArgumentError(
              'At least one output option must be passed'
            );
          }
          await generateAssets(options);
        } catch (error) {
          if (error instanceof VectorImageError) {
            if (error instanceof ArgumentError) {
              console.error(chalk.bold.red(error.message));
            } else {
              console.error(chalk.bold.red('Failed to generate vector assets'));
              if (error.file) {
                console.error(
                  `${chalk.bold(path.relative(process.cwd(), error.file))}: ${
                    error.message
                  }`
                );
              } else {
                console.error(error.message);
              }
            }
          } else {
            console.error(error.stack || error.message);
          }
          process.exit(1);
        }
      }
    )
    .strict()
    .help().argv;
}

module.exports = main;
