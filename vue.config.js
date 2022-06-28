const path = require('path');
const resolve = (dir = '') => path.join(__dirname, './src', dir);

module.exports = {
  publicPath: './',
  configureWebpack: () => {
    const config = {
      output: {
        filename:'js/[name].[hash].js',
        chunkFilename: 'js/[name].js'
      },
      resolve: {
        alias: {
          '~': resolve(),
          '~components': resolve('components')
        }
      }
    }
    return config
  }
}