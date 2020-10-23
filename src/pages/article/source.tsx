import React from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'

import './index.scss'

const ArticleSource = () => {
    const router = getCurrentInstance().router
    const source = decodeURIComponent(router?.params.source || '')
    return (
        <View className="article view-content">
            <WebView src={source}></WebView>
        </View>
    )
}

export default ArticleSource