// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
      "postcss-write-svg": { utf8: false },
      "postcss-px-to-viewport": {
          viewportWidth: 1920, // 容器宽度，也可以看作设计图的宽度
          // viewportHeight: 1080, // 容器高度，可以不配置
          unitPrecision: 3, // px转换为vw后保留的小数位
          viewportUnit: 'vw', // px需要转换成的单位，使用vw
          // selectorBlackList: [/^body$/], // 不需要转换为其他单位的的class类
          minPixelValue: 1, // 小于等于1px不转换
          mediaQuery: false // 是否允许在媒体查询中使用px
      },
  }
}
