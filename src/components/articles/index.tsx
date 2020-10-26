import React from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import { INewsProps } from '@constants/common'
import './index.scss'

const Articles = (props: INewsProps) => {
    
    const toArticleDetail = (item: any) => {
        if (item.source) {
            const source = encodeURIComponent(item.source)
            Taro.navigateTo({
                url: `/pages/article/source?source=${source}`
            })
        } else {
            Taro.navigateTo({
                url: `/pages/article/index?id=${item.id}`
            })
        }
    }
    return (
        <View className="articles view-content">
            {
                props.list.map((item: any, index: number) => (
                    <View key={index} className="item" onClick={() => toArticleDetail(item)}>
                        <View className="item-text">
                            <View className="title">{item.title}</View>
                            <View className="describe">{item.description}</View>
                        </View>
                        <View className="item-photo">
                            <Image src={item.image_path}></Image>
                        </View>
                    </View>
                ))
            }
        </View>
    )
}

export default React.memo(Articles)