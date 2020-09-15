const path = require('path')
const merge = require('deepmerge')

module.exports = {

    // Original

  configureWebpack: {
    resolve: {
      symlinks: false
    }

    // From logrocket tutorial

  // publicPath: '/project name/'

  },

  chainWebpack: config => {
    config.module
      .rule('md')
      .test(/\.md$/)
        .use('raw-loader')
        .loader('raw-loader')

    config.module.rule('stylus').oneOf('vue').use('postcss-loader')
      .tap(options =>
        merge(options, {
          config: {
            path: path.resolve(__dirname, '.postcssrc')
          }
        })
      )
  }
}
