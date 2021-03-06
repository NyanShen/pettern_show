const path = require('path')

const config = {
  projectName: 'mini',
  date: '2020-8-6',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    webpackChain(chain, webpack) {
      // chain.plugin('analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  alias: {
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@constants': path.resolve(__dirname, '..', 'src/constants'),
    '@services': path.resolve(__dirname, '..', 'src/services'),
    '@hooks': path.resolve(__dirname, '..', 'src/hooks'),
    '@utils': path.resolve(__dirname, '..', 'src/utils'),
    '@assets': path.resolve(__dirname, '..', 'src/assets'),
    '@styles': path.resolve(__dirname, '..', 'src/styles'),
    '@pages': path.resolve(__dirname, '..', 'src/pages'),
  },
  sass: {
    resource: path.resolve(__dirname, '..', 'src/styles/variable.scss')
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
