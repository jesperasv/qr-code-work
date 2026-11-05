const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const ElementPlus = require('unplugin-element-plus/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  publicPath: './',
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      ElementPlus({
        useSource: false
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  chainWebpack: (config) => {
    config.module.rule('images').exclude.add(/src[\\/]assets[\\/]presets/).end()
    config.module
      .rule('preset-images')
      .test(/src[\\/]assets[\\/]presets[\\/].+\.png$/)
      .type('asset/inline')
  },
})