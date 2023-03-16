module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [['module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.jsx'],
        alias: {
          '@': './components',
          'constants': './constants',
          'navigations': './navigations',
          'services': './services',
          'screens': './screens'
        },
      },]]
  };
};
