import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import app from '@services/request'
import api from '@services/api'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'

import './index.scss'

interface IParam {
    currentPage: number
}

const INIT_PARAM: IParam = {
    currentPage: 1
}

interface IProps {
    type: string,
    title?: string
}

const Photos = (props: IProps, ref: any) => {
    const PAGE_LIMIT = 10
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
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
            setShowEmpty(totalPage <= INIT_PARAM.currentPage)
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
    }, [param.currentPage, props.title])

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

    const toPhotoList = useCallback((id: string) => {
        Taro.navigateTo({
            url: `/pages/photo/index?id=${id}`
        })
    }, [])

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