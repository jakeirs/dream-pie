const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Extract resolver to preserve existing properties
const { resolver } = config;

config.resolver = {
  ...resolver,
  alias: {
    '@': path.resolve(__dirname, '.'),
    '@/components': path.resolve(__dirname, './components'),
    '@/components/ui': path.resolve(__dirname, './components/ui'),
    '@/components/PAGE': path.resolve(__dirname, './components/PAGE'),
    '@/assets': path.resolve(__dirname, './assets'),
    '@/app': path.resolve(__dirname, './app'),
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
