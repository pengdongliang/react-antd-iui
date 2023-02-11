import { resolve } from 'path'

export default {
  // cssModules: true, // 默认是 .module.css 走 css modules，.css 不走 css modules。配置 cssModules 为 true 后，全部 css 文件都走 css modules。（less 文件同理）
  cjs: { output: 'lib' },
  esm: { output: 'es' },
  umd: { output: 'dist',
    extraBabelPlugins: [ // antd5以下可能需要开启
      ['import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css', // true: 源文件被导入，并且可以在编译期间进行优化.less. css: 预捆绑的 css 文件将按原样导入, .css
      }],
    ],
  },
  // extraBabelPlugins: [ // antd5以下可能需要开启
  //   ['import', {
  //     libraryName: 'antd',
  //     libraryDirectory: 'es',
  //     style: 'css', // true: 源文件被导入，并且可以在编译期间进行优化.less. css: 预捆绑的 css 文件将按原样导入, .css
  //   }],
  // ],
  alias: { '@': resolve(__dirname, './src'), }
}
