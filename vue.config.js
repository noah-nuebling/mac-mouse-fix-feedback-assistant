const path = require('path')
const merge = require('deepmerge')

module.exports = {

    // Original

  // configureWebpack: {
  //     resolve: {
  //       symlinks: false
  //     }
  //   },

    // From logrocket tutorial / vue deployment tutorial

  publicPath: process.env.NODE_ENV = 'production'
      ? '/mac-mouse-fix-issue-helper/'
      : '/',


  chainWebpack: config => {

    config.module
      .rule('md')
      .test(/\.md$/)
        .use('raw-loader')
        .loader('raw-loader')

    config.module
      .rule('txt')
      .test(/\.txt$/)
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
