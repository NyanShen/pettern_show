import React, { useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import { INewsProps } from '@constants/common'
import './index.scss'

const Photos = (props: INewsProps) => {

    const toPhotoList = useCallback((item: any) => {
        Taro.navigateTo({
            url: `/pages/${props.type}/index?id=${item.id}&title=${item.title}&subtitle=${item.sub_title}`
        })
    }, [])

    return (
        <View className="photos">
            {
                props.list.map((item: any, index: number) => (
                    <View key={index} className="item" onClick={() => toPhotoList(item)}>
                        <View className="item-photo">
                            <Image src={item.image_path} mode="aspectFill"></Image>
                        </View>
                        <View className="item-text">
                            <View className="title">{item.title}</View>
                            <View className="sub-title">{item.sub_title}</View>
                        </View>
                        <View className="item-mask"></View>
                    </View>
                ))
            }
        </View>
    )
}

export default React.memo(Photos)