const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve(
    'react-native-svg-transformer/react-native',
  ),
};

config.resolver = {
  ...config.resolver,

  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),

  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
