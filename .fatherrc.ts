export default {
  // cssModules: true, // 默认是 .module.css 走 css modules，.css 不走 css modules。配置 cssModules 为 true 后，全部 css 文件都走 css modules。（less 文件同理）
  cjs: {},
  esm: {},
  umd: {},
  extraBabelPlugins: [
    ['import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true, // true: 源文件被导入，并且可以在编译期间进行优化. css: 预捆绑的 css 文件将按原样导入
    }],
  ],
}
