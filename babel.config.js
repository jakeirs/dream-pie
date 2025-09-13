module.exports = function (api) {
  api.cache(true);
  let plugins = [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
          '@/components': './components',
          '@/components/ui': './components/ui',
          '@/components/PAGE': './components/PAGE',
          '@/assets': './assets',
          '@/app': './app',
          '@/types': './types',
          '@/mockData': './mockData',
          'tailwind.config': './tailwind.config.js',
        },
      },
    ],
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
