import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import isEqual from 'lodash/isEqual'

import api from '@services/api'
import app from '@services/request'
import { INewsParam } from '@constants/common'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import './index.scss'


const Photos = (props: INewsParam, ref: any) => {
    const PAGE_LIMIT = 10
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<INewsParam>(props)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [photos, setPhotos] = useState<any[]>([])
    const paramRef = useRef<any>({})

    useEffect(() => {
        if (isEqual(paramRef.current, param)) {
            return
        }
        paramRef.current = param
        app.request({
            url: app.apiUrl(api.newsList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT,
                type: param.type,
                title: param.title
            }
        }, { loading: false }).then((result: any) => {
            setLoading(false)
            const totalPage = getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            setShowEmpty(totalPage <= props.currentPage)
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
    }, [param])

    useImperativeHandle(ref, () => ({
        onScorllToLower: handleScrollToLower,
        onParamChange: handleParamChange
    }), [page.totalPage, param.currentPage])

    const handleParamChange = (type: string, title: string = '') => {
        setParam({
            type,
            title,
            currentPage: props.currentPage
        })
    }

    const handleScrollToLower = useCallback(() => {
        if (page.totalPage > param.currentPage) {
            setLoading(true)
            setParam({
                ...param,
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

export default React.memo(forwardRef(Photos))