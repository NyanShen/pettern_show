import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'

import { INewsParam, INewsProps, INIT_NEWS_PARAM } from '@constants/common'
import './index.scss'


const Photos = (props: INewsProps, ref: any) => {
    const PAGE_LIMIT = 10
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<INewsParam>(INIT_NEWS_PARAM)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [photos, setPhotos] = useState<any[]>([])

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
                setPhotos(result.data)
            } else {
                setPhotos([...photos, ...result.data])
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

    const toPhotoList = useCallback((item: any) => {
        Taro.navigateTo({
            url: `/pages/photo/index?id=${item.id}&title=${item.title}&subtitle=${item.sub_title}`
        })
    }, [])

    return (
        <View className="photos">
            {
                photos.map((item: any, index: number) => (
                    <View key={index} className="item" onClick={() => toPhotoList(item)}>
                        <View className="item-photo">
                            <Image src={item.image_path}></Image>
                        </View>
                        <View className="item-text">
                            <View className="title">{item.title}</View>
                            <View className="sub-title">{item.sub_title}</View>
                        </View>
                        <View className="item-mask"></View>
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

export default forwardRef(Photos)