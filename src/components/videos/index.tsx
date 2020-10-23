import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { useShareAppMessage } from '@tarojs/taro'
import { View, Video, Button, Text } from '@tarojs/components'
import classnames from 'classnames'

import app from '@services/request'
import api from '@services/api'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import { INewsParam, INewsProps, INIT_NEWS_PARAM } from '@constants/common'
import './index.scss'

const Videos = (props: INewsProps, ref: any) => {
    const PAGE_LIMIT = 10
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<INewsParam>(INIT_NEWS_PARAM)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [folder, setFolder] = useState<boolean>(false)
    const [videos, setVideos] = useState<any[]>([])

    useShareAppMessage((res: any) => {
        const index = res.target.dataset.index
        const target = videos[index]
        return {
            title: target.title,
            imageUrl: target.image_path,
            path: `/pages/video/index?id=${target.id}`
        }
    })

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
                setVideos(result.data)
            } else {
                setVideos([...videos, ...result.data])
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

    const toggleFolder = (index: number) => {
        const target = videos[index]
        if (target.folder) {
            target.folderText = '展开'
            target.folderIcon = 'icon-down'
        } else {
            target.folderText = '收起'
            target.folderIcon = 'icon-up'
        }
        target.folder = !target.folder
        setFolder(!folder)
    }

    return (
        <View className="videos">
            {
                videos.map((item: any, index: number) => (
                    <View key={index} className="item">
                        <View className="item-video">
                            <Video
                                id='video'
                                style={{ width: '100%' }}
                                src={item.video_path}
                                poster={item.image_path}
                                controls={true}
                                loop={false}
                                muted={false}
                            />
                        </View>
                        <View className="item-text">
                            <View className="title">{item.title}</View>
                            <Button className="button" openType="share" data-index={index}>
                                <Text className="iconfont icon-ArtboardCopy"></Text>
                            </Button>
                        </View>
                        {
                            item.folder &&
                            <View className="item-text">
                                <View className="sub-title">{item.description}</View>
                            </View>
                        }
                        <View className="item-folder" onClick={() => toggleFolder(index)}>
                            <Text className={classnames('iconfont', item.folderIcon || 'icon-down')}></Text>
                            <Text className="folder-text">{item.folderText || '展开'}</Text>
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

export default forwardRef(Videos)