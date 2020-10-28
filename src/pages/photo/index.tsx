import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { ScrollView, View, Image } from '@tarojs/components'
import map from 'lodash/map'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

const INIT_PHOTO = []

const PhotoList = () => {
    const router = getCurrentInstance().router
    const { contentHeight } = useNavData()
    const [photo, setPhoto] = useState<any[]>(INIT_PHOTO)

    useEffect(() => {
        app.request({
            url: app.apiUrl(api.getNewsImages),
            data: {
                id: router?.params.id
            }
        }).then((result: any) => {
            setPhoto(result)
        })
    }, [])

    const handleImageClick = (imagePath: string) => {
        Taro.previewImage({
            current: imagePath,
            urls: map(photo, 'image_path')
        })
    }

    return (
        <View className="photo">
            <NavBar back={true} />
            <View className="header">
                <View className="sub-title">{router?.params.subtitle}</View>
                <View className="title">{router?.params.title}</View>
            </View>
            <ScrollView style={{ maxHeight: contentHeight }} scrollY>
                <View className="photo-list">
                    {
                        photo.map((item: any, index: number) => (
                            <View key={index} className="photo-item" onClick={() => handleImageClick(item.image_path)}>
                                <Image src={item.image_path} mode="aspectFill"></Image>
                            </View>
                        ))
                    }
                </View>
                <View className="empty-container">
                    <View>没有更多了</View>
                </View>
            </ScrollView>
        </View>
    )
}

export default PhotoList