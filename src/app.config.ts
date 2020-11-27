import { Config } from '@tarojs/taro';

export default {
  pages: [
    'pages/index/index',
    'pages/video/index',
    'pages/photo/index',
    'pages/design/index',
    'pages/article/index',
    'pages/article/source',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
    // navigationStyle: 'custom',
  },
} as Config
