const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const vueSrc = 'resources/Piaf-Vue'

module.exports = {
  pages: {
    index: {
      entry: path.join(__dirname, vueSrc, 'src/index.js'),
      template: path.join(__dirname, vueSrc, 'public/index.html'),
      filename: 'index.html'
    },
    backend: {
      entry: path.join(__dirname, vueSrc, 'src/index.js'),
      template: path.join(__dirname, vueSrc, 'public/backend.html'),
      filename: path.join(__dirname, 'resources/views/piaf.blade.php')
    }
  },
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: 'dist',
    compress: true,
    open: true,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    quiet: true,
    watchOptions: {
      poll: false,
      ignored: /node_modules/
    },
    proxy: {
      '/api': {
        target: 'http://local.aiinad.com/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
    /*
      api 통신을 할 때 현재 frontend 웹서버에서는 백엔드 서버의 api에 접근 할 수 없다.
      /api 호출이 올 경우 백엔드 개발서버로 proxy를 돌려 백엔드 데이터를 호출 하는 설정
     */
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
  },
  outputDir: path.join(__dirname, 'public/dist'),
  productionSourceMap: false,
  assetsDir: '../assets/',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, vueSrc, 'src')
      }
    },
    plugins: [
      new CopyWebpackPlugin([
        // for Local Development
        { from: path.join(__dirname, vueSrc, 'src/assets/img'), to: 'assets/img' },
        { from: path.join(__dirname, vueSrc, 'src/assets/fonts'), to: 'assets/fonts' },
        // for Production
        { from: path.join(__dirname, vueSrc, 'src/assets/img'), to: '../assets/img' },
        { from: path.join(__dirname, vueSrc, 'src/assets/fonts'), to: '../assets/fonts' }
      ])
    ]
  },
}
