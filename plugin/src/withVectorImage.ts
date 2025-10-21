import {
  ConfigPlugin,
  withAppBuildGradle,
  ExportedConfigWithProps,
  XcodeProject,
  withXcodeProject,
  withDangerousMod,
} from 'expo/config-plugins';
import path from 'node:path';

export enum GenerateCommands {
  EntryFile = '--entry-file',
  Config = '--config',
  ResetCache = '--reset-cache',
  BundleWithExpo = '--bundle-with-expo',
}

const DefaultCommands: { command: GenerateCommands; input: string }[] = [
  {
    command: GenerateCommands.EntryFile,
    input: 'index.ts',
  },
  {
    command: GenerateCommands.BundleWithExpo,
    input: 'true',
  },
];

export const addStripSvgsImplementation = (projectBuildGradle: string) => {
  const addString = `apply from: new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), "../../react-native-vector-image/strip_svgs.gradle")`;
  const searchString = /"..\/react.gradle"\)\n/gm;

  if (projectBuildGradle.includes(addString)) {
    return projectBuildGradle;
  }

  return projectBuildGradle.replace(
    searchString,
    `"../react.gradle")\n${addString}`
  );
};

const withStripSvgsAndroid: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, ({ modResults, ...config }) => {
    modResults.contents = addStripSvgsImplementation(modResults.contents);
    return { modResults, ...config };
  });
};

const addSlashes = (str: string) => {
  return str.replace(/[\\"]/g, '\\$&').replace(/\u0000/g, '\\0');
};

export const setPBXShellScriptBuildPhaseStripSvg = async (
  config: ExportedConfigWithProps<XcodeProject>
) => {
  const xcodeProject = config.modResults;
  const pbxShellScriptBuildPhases =
    xcodeProject.hash.project.objects.PBXShellScriptBuildPhase;
  for (const buildPhase of Object.values<{ name: string; shellScript: string }>(
    pbxShellScriptBuildPhases
  )) {
    if (
      buildPhase?.name === '"Bundle React Native code and images"' &&
      !buildPhase?.shellScript.includes('"react-native-vector-image"')
    ) {
      buildPhase.shellScript =
        buildPhase.shellScript.substring(0, buildPhase.shellScript.length - 1) +
        addSlashes(
          `\n\`"$NODE_BINARY" --print "require('path').dirname(require.resolve('react-native-vector-image/package.json')) + '/strip_svgs.sh'"\``
        ) +
        '"';
    }
  }
  return config;
};

const withStripSvgsIos: ConfigPlugin = (c) => {
  return withXcodeProject(c, async (config) => {
    config = await setPBXShellScriptBuildPhaseStripSvg(config);
    return config;
  });
};

const getCliPath = () => {
  return path.join(path.dirname(path.dirname(__dirname)), 'src/cli/index');
};

export const getCommands = (commands = DefaultCommands) => {
  const commandsMap = new Map<GenerateCommands, string>();
  commands.forEach((c) => commandsMap.set(c.command, c.input));
  DefaultCommands.forEach((c) => {
    const exists = commandsMap.has(c.command);
    if (!exists) {
      commandsMap.set(c.command, c.input);
    }
  });
  return Array.from(commandsMap)
    .map((arr) => `${arr[0]} ${arr[1]}`)
    .join(' ');
};

const runCli = (cliCommand: string) => {
  const cliPath = getCliPath();
  const cli = require(cliPath);
  if (!cli) {
    throw new Error('Could not find react-native-vector-image cli');
  }
  cli(cliCommand);
};

export const withGenerateIosAssets: ConfigPlugin<string | void> = (
  config,
  commands
) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const appName = config.modRequest.projectName;
      runCli(
        `generate --no-android-output --ios-output ios/${appName}/Images.xcassets ${commands}`
      );
      return config;
    },
  ]);
};
export const withGenerateAndroidAssets: ConfigPlugin<string | void> = (
  config,
  commands
) => {
  return withDangerousMod(config, [
    'android',
    (config) => {
      runCli(`generate --no-ios-output ${commands}`);
      return config;
    },
  ]);
};
type VectorImagePlugin = ConfigPlugin<{
  customMetroConfigFile?: string;
  resetCache?: boolean;
  customEntryFile?: string;
  stripSvgs?: boolean;
  bundleWithExpo?: boolean;
} | void>;

/**
 * Apply VectorImage configuration for Expo projects.
 */
const withVectorImage: VectorImagePlugin = (config, props = {}) => {
  const commands: { command: GenerateCommands; input: string }[] = [];
  if (props?.customEntryFile) {
    commands.push({
      command: GenerateCommands.EntryFile,
      input: props?.customEntryFile,
    });
  }
  if (props?.customMetroConfigFile) {
    commands.push({
      command: GenerateCommands.Config,
      input: props?.customMetroConfigFile,
    });
  }
  if (props?.resetCache) {
    commands.push({
      command: GenerateCommands.ResetCache,
      input: `${props?.resetCache}`,
    });
  }
  if (props?.bundleWithExpo) {
    commands.push({
      command: GenerateCommands.BundleWithExpo,
      input: `${props?.bundleWithExpo}`,
    });
  }
  const commandsWithDefault = getCommands(commands);

  if (props?.stripSvgs) {
    config = withStripSvgsIos(config);
    config = withStripSvgsAndroid(config);
  }

  config = withGenerateIosAssets(config, commandsWithDefault);
  config = withGenerateAndroidAssets(config, commandsWithDefault);
  return config;
};

export default withVectorImage;
