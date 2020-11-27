import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { ScrollView, View, Image } from '@tarojs/components'
import map from 'lodash/map'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import './index.scss'
import Loading from '@components/loading'

const INIT_PHOTO = []

const PhotoList = () => {
    const router = getCurrentInstance().router
    const { contentHeight } = useNavData()
    const [loading, setLoading] = useState<boolean>(false)
    const [photo, setPhoto] = useState<any[]>(INIT_PHOTO)

    useEffect(() => {
        setLoading(true)
        app.request({
            url: app.apiUrl(api.getNewsImages),
            data: {
                id: router?.params.id
            }
        }, { loading: false }).then((result: any) => {
            setPhoto(result)
            setLoading(false)
        })
    }, [])

    const handleImageClick = (imagePath: string) => {
        Taro.previewImage({
            current: imagePath,
            urls: map(photo, 'image_path')
        })
    }
    const renderLoading = () => useMemo(() => {
        return <Loading loading={loading}></Loading>
    }, [loading])

    return (
        <View className="photo">
            <ScrollView style={{ maxHeight: contentHeight }} scrollY>
                <View className="header">
                    <View className="sub-title">{router?.params.subtitle}</View>
                    <View className="title">{router?.params.title}</View>
                </View>
                <View className="photo-list">
                    {
                        photo.map((item: any, index: number) => (
                            <View key={index} className="photo-item" onClick={() => handleImageClick(item.image_path)}>
                                <Image src={item.image_path} mode="aspectFill"></Image>
                            </View>
                        ))
                    }
                </View>
                {renderLoading()}
            </ScrollView>
        </View>
    )
}

export default PhotoList