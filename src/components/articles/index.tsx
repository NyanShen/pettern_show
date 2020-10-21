import React, { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'

import app from '@services/request'
import api from '@services/api'
import './index.scss'

const Articles = () => {
    const [articles, setArticles] = useState<any[]>([])

    useEffect(() => {
        app.request({
            url: app.testApiUrl(api.getArticleList),
            data: {
                page: 1,
                limit: 20
            }
        }).then((result: any) => {
            setArticles(result.data)
        })
    }, [])

    return (
        <View className="articles view-content">
            {
                articles.map((item: any, index: number) => (
                    <View key={index} className="item">
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

export default Articles