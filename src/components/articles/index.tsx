import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import app from '@services/request'
import api from '@services/api'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import { INewsParam, INewsProps, INIT_NEWS_PARAM } from '@constants/common'
import './index.scss'

const Articles = (props: INewsProps, ref: any) => {
    const PAGE_LIMIT = 10
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<INewsParam>(INIT_NEWS_PARAM)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [articles, setArticles] = useState<any[]>([])

    useEffect(() => {
        app.request({
            url: app.apiUrl(api.newsList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT,
                type: props.type,
                title: props.title
            }
        }, { loading: false }).then((result: any) => {
            setLoading(false)
            const totalPage = getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            setShowEmpty(totalPage <= INIT_NEWS_PARAM.currentPage)
            setPage({
                totalCount: result.pagination.totalCount,
                totalPage
            })

            if (param.currentPage === 1) {
                setArticles(result.data)
            } else {
                setArticles([...articles, ...result.data])
            }
        })
    }, [param.currentPage, props.title, props.type])

    useImperativeHandle(ref, () => ({
        innerFn: handleScrollToLower
    }), [page.totalPage, param.currentPage])

    const handleScrollToLower = useCallback(() => {
        if (page.totalPage > param.currentPage) {
            setLoading(true)
            setParam({
                currentPage: param.currentPage + 1
            })
        } else {
            setShowEmpty(true)
        }
    }, [page.totalPage, param.currentPage])

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
                articles.map((item: any, index: number) => (
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
            {
                loading &&
                <View className="empty-container">
                    <Text>正在加载中...</Text>
                </View>
            }
            {
                showEmpty &&
                <View className="empty-container">
                    <Text>没有更多数据了</Text>
                </View>
            }
        </View>
    )
}

export default forwardRef(Articles)