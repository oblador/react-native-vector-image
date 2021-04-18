<p align="center">
  <h1 align="center">React Native Vector Image</h1>
  <h3 align="center">Generate iOS/Android native vector assets from SVG.</h3>
</p>

- Faster render time, about 5x on Android.
- Smaller JS bundle, which leads to faster startup.
- Platform native dark mode support.

## Installation

```sh
yarn add react-native-vector-image @klarna/react-native-drawable-android
```

## Usage

Since native vector assets cannot be served over http via metro dev server, they must be generated and compiled into the app bundle.

### Step 1: import an .svg file

```js
import VectorImage from 'react-native-vector-image';

const App = () => <VectorImage source={require('./image.svg')} />;
```

To add dark mode to your image, create a new file with an `.dark.svg` extension, ie `image.svg` = light and `image.dark.svg` = dark.

### Step 2: generate native assets

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
