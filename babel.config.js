module.exports = function (api) {
  api.cache(true);
  let plugins = ['react-native-worklets/plugin', 'react-native-reanimated/plugin'];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins,
  };
};
