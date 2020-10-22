import { Config } from '@tarojs/taro';

export default {
  pages: [
    'pages/index/index',
    'pages/photo/index',
    'pages/article/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom',
  },
} as Config
