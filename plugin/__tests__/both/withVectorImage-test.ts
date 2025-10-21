import { GenerateCommands, getCommands } from '../../src/withVectorImage';

describe('command generation', () => {
  it('generates list of commands correct', async () => {
    const defaultCommands = getCommands();
    const customCommands1 = getCommands([
      { command: GenerateCommands.Config, input: 'metro2.config.js' },
    ]);
    const customCommands2 = getCommands([
      { command: GenerateCommands.EntryFile, input: 'app.js' },
    ]);
    const customCommands3 = getCommands([
      { command: GenerateCommands.ResetCache, input: 'true' },
    ]);
    const customCommands4 = getCommands([
      { command: GenerateCommands.ResetCache, input: 'true' },
      { command: GenerateCommands.EntryFile, input: 'app.js' },
      { command: GenerateCommands.Config, input: 'metro2.config.js' },
      { command: GenerateCommands.BundleWithExpo, input: 'false' },
    ]);
    expect(defaultCommands).toEqual(
      '--entry-file index.ts --bundle-with-expo true'
    );
    expect(customCommands1).toEqual(
      '--config metro2.config.js --entry-file index.ts --bundle-with-expo true'
    );
    expect(customCommands2).toEqual(
      '--entry-file app.js --bundle-with-expo true'
    );
    expect(customCommands3).toEqual(
      '--reset-cache true --entry-file index.ts --bundle-with-expo true'
    );
    expect(customCommands4).toEqual(
      '--reset-cache true --entry-file app.js --config metro2.config.js --bundle-with-expo false'
    );
  });
});
