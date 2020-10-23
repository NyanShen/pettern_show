import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { RichText, View } from '@tarojs/components'
import NavBar from '@components/navbar'

import api from '@services/api'
import app from '@services/request'
import { formatTimestamp } from '@utils/index'
import './index.scss'

const Article = () => {
    const router = getCurrentInstance().router
    const [article, setArticle] = useState<any>({ newsInfo: {} })

    useEffect(() => {
        app.request({
            url: app.apiUrl(api.newsDetail),
            data: {
                id: router?.params.id
            }
        }).then((result: any) => {
            setArticle(result)
        })
    }, [])
    
    return (
        <View className="article">
            <NavBar back={true}></NavBar>
            <View className="article-header">
                <View className="title">{article.title}</View>
                <View className="publish">
                    <View className="item date">{formatTimestamp(article.modified, 'yy-MM-dd')}</View>
                </View>
            </View>
            <View className="article-content view-content">
                {
                    article.newsInfo.content &&
                    <RichText nodes={article.newsInfo.content.replace(/img/ig, 'img style="width: 100%; height: auto;"')}></RichText>
                }
            </View>
        </View>
    )
}

export default Article