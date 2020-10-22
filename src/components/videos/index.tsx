import React, { useEffect, useState } from 'react'
import { useShareAppMessage } from '@tarojs/taro'
import { View, Video, Button, Text } from '@tarojs/components'
import classnames from 'classnames'

import app from '@services/request'
import api from '@services/api'
import './index.scss'

const Videos = () => {
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
            url: app.testApiUrl(api.getVideoList),
            data: {
                page: 1,
                limit: 20
            }
        }).then((result: any) => {
            setVideos(result.data)
        })
    }, [])

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
        </View>
    )
}

export default React.memo(Videos)