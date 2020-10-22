import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import app from '@services/request'
import api from '@services/api'
import './index.scss'

const Photos = () => {

    const [photos, setPhotos] = useState<any[]>([])

    useEffect(() => {
        app.request({
            url: app.testApiUrl(api.getPhotoList),
            data: {
                page: 1,
                limit: 20
            }
        }).then((result: any) => {
            setPhotos(result.data)
        })
    }, [])

    const toPhotoList = (id: string) => {
        Taro.navigateTo({
            url: `/pages/photo/index?id=${id}`
        })
    }
    return (
        <View className="photos">
            {
                photos.map((item: any, index: number) => (
                    <View key={index} className="item" onClick={() => toPhotoList(item.id)}>
                        <View className="item-photo">
                            <Image src={item.image_path}></Image>
                        </View>
                        <View className="item-text">
                            <View className="title">{item.title}</View>
                            <View className="sub-title">{item.sub_title}</View>
                        </View>
                    </View>
                ))
            }
        </View>
    )
}

export default React.memo(Photos)