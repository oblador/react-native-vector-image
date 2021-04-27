<p align="center">
  <h1 align="center">React Native Vector Image</h1>
  <h3 align="center">iOS/Android native vector assets generated from SVG.</h3>
</p>

[![Tests](https://github.com/oblador/react-native-vector-image/actions/workflows/tests.yml/badge.svg)](https://github.com/oblador/react-native-vector-image/actions/workflows/tests.yml) [![npm](https://img.shields.io/npm/v/react-native-vector-image.svg)](https://npmjs.com/package/react-native-vector-image)


- Faster render – ~5x faster than `react-native-svg`.
- Smaller JS bundle = faster startup.
- Native support for dark mode.

## Installation

```sh
yarn add react-native-vector-image @klarna/react-native-vector-drawable
```

### Android

Edit `android/app/build.gradle` to look like this (without the +):

```diff
project.ext.react = [
    enableHermes: false,  // clean and rebuild if changing
]

apply from: "../../node_modules/react-native/react.gradle"
+ apply from: "../../node_modules/react-native-vector-image/strip_svgs.gradle"
```

### iOS

Open your project in Xcode, select the _Build Phases_ tab, and edit the `Bundle React Native code and images` script to look like this (without the +):

```diff
set -e

export NODE_BINARY=node
../node_modules/react-native/scripts/react-native-xcode.sh
+ ../node_modules/react-native-vector-image/strip_svgs.sh
```

<img width="1212" alt="" src="https://user-images.githubusercontent.com/378279/115999935-544c0600-a5ee-11eb-9c59-6fb50e434ed0.png">

## Usage

Since native vector assets cannot be served over http via metro dev server, they must be generated and compiled into the app bundle.

### Step 1: import an .svg file

```js
import VectorImage from 'react-native-vector-image';

const App = () => <VectorImage source={require('./image.svg')} />;
```

To add dark mode to your image, create a new file with an `.dark.svg` extension, ie `image.svg` = light and `image.dark.svg` = dark.

### Step 2: generate native assets

This takes a while as metro has to go through all the code to find the imported SVGs.

```sh
yarn react-native-vector-image generate
```

| Argument              | Description                                     | Default                       |
| --------------------- | ----------------------------------------------- | ----------------------------- |
| `--entry-file`        | Path to the app entrypoint file.                | `index.js`                    |
| `--config`            | Path to the metro config file.                  | `metro.config.js`             |
| `--reset-cache`       | Reset metro cache before extracting SVG assets. | `false`                       |
| `--ios-output`        | Path to an iOS `.xcassets` folder.              | `ios/AppName/Images.xcassets` |
| `--no-ios-output`     | Disable iOS output.                             | `false`                       |
| `--android-output`    | Path to an Android `res` folder.                | `android/app/src/main/res`    |
| `--no-android-output` | Disable Android output.                         | `false`                       |

### Step 3: recompile

```sh
yarn react-native run-ios
# or
yarn react-native run-android
```

## Troubleshooting

### `generate` command outputs "Error while parsing image.svg"

Some optimizations applied by SVGO are not compatible with the SVG parser on Android. Try to re-export the SVG without optimizing it.

### `<VectorImage />` warns "Could not find image"

It means that the native vector asset does not exist or is out of sync with the SVG. Simply generate the files and recompile the app.

## License

[MIT License](http://opensource.org/licenses/mit-license.html). © Joel Arvidsson 2021

[`svg2vd`](https://github.com/Shopify/svg2vd): MIT © 2020 Shopify
