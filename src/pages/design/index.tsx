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

const DesignList = () => {
    const router = getCurrentInstance().router
    const { contentHeight } = useNavData()
    const [loading, setLoading] = useState<boolean>(false)
    const [design, setDesign] = useState<any[]>(INIT_PHOTO)

    useEffect(() => {
        setLoading(true)
        app.request({
            url: app.apiUrl(api.getNewsImages),
            data: {
                id: router?.params.id
            }
        }, { loading: false }).then((result: any) => {
            setDesign(result)
            setLoading(false)
        })
    }, [])

    const handleImageClick = (imagePath: string) => {
        Taro.previewImage({
            current: imagePath,
            urls: map(design, 'image_path')
        })
    }

    const renderLoading = () => useMemo(() => {
        return <Loading loading={loading}></Loading>
    }, [loading])

    return (
        <View className="design">
            <ScrollView style={{ maxHeight: contentHeight }} scrollY>
                <View className="header">
                    <View className="sub-title">{router?.params.subtitle}</View>
                    <View className="title">{router?.params.title}</View>
                </View>
                <View className="design-list">
                    {
                        design.map((item: any, index: number) => (
                            <View key={index} className="design-item" onClick={() => handleImageClick(item.image_path)}>
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

export default DesignList