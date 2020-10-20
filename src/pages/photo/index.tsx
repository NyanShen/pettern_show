import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { ScrollView, View, Image } from '@tarojs/components'
import { map } from 'lodash'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

const INIT_PHOTO = [
    {
        image_path: "http://192.168.2.248/assets/images/1400x933_1.jpg"
    },
    {
        image_path: "http://192.168.2.248/assets/images/1400x933_6.jpg"
    }
]

const PhotoList = () => {
    const { contentHeight } = useNavData()
    const [photo] = useState<any[]>(INIT_PHOTO)

    const handleImageClick = (imagePath: string) => {
        Taro.previewImage({
            current: imagePath,
            urls: map(INIT_PHOTO, 'image_path')
        })
    }

    return (
        <View className="photo">
            <NavBar back={true} />
            <View className="header">
                <View className="title">视觉海报输出</View>
                <View className="sub-title">美食襄阳</View>
            </View>
            <ScrollView style={{ maxHeight: contentHeight }} scrollY>
                <View className="photo-list">
                    {
                        photo.map((item: any, index: number) => (
                            <View key={index} className="photo-item" onClick={() => handleImageClick(item.image_path)}>
                                <Image src={item.image_path}></Image>
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