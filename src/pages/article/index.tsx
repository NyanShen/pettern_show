import React from 'react'
import { RichText, View } from '@tarojs/components'
import NavBar from '@components/navbar'

import './index.scss'

const Article = () => {
    const content = ''
    return (
        <View className="article">
            <NavBar back={true}></NavBar>
            <View className="article-header">
                <View className="title">测试测试测试测试测试测试测试测试测试测试</View>
                <View className="publish">
                    <View className="item tag">原创</View>
                    <View className="item name">西子丢</View>
                    <View className="item link">图集案例</View>
                    <View className="item date">2020-10-22</View>
                </View>
            </View>
            <View className="article-content view-content">
                <RichText nodes={content.replace(/img/ig, 'img style="width: 100%; height: auto;"')}></RichText>
            </View>
        </View>
    )
}

export default Article