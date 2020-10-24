import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useShareAppMessage } from '@tarojs/taro'
import { View, Video, Button, Text } from '@tarojs/components'
import classnames from 'classnames'
import isEqual from 'lodash/isEqual'

import api from '@services/api'
import app from '@services/request'
import { INewsParam } from '@constants/common'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import './index.scss'

const Videos = (props: INewsParam, ref: any) => {
    const PAGE_LIMIT = 10
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<INewsParam>(props)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [folder, setFolder] = useState<boolean>(false)
    const [videos, setVideos] = useState<any[]>([])
    const paramRef = useRef<any>({})

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
                setVideos(result.data)
            } else {
                setVideos([...videos, ...result.data])
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

export default React.memo(forwardRef(Videos))