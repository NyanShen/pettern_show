import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Video, Button, Text } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import '@components/videos/index.scss'
import './index.scss'
interface IFolder {
    fold: boolean
    text: string
    icon: string
}
const INIT_FOLDER = {
    fold: false,
    text: '展开',
    icon: 'icon-down'
}
const VideoDetail = () => {
    const router = getCurrentInstance().router
    const videoId = router?.params.id
    const [video, setVideo] = useState<any>({})
    const [folder, setFolder] = useState<IFolder>(INIT_FOLDER)

    useEffect(() => {
        app.request({
            url: app.apiUrl(api.newsDetail),
            data: {
                id: videoId || '1000006'
            }
        }).then((result: any) => {
            setVideo(result)
        })
    }, [])

    const toggleFolder = () => {
        if (folder.fold) {
            setFolder(INIT_FOLDER)
        } else {
            setFolder({
                fold: true,
                text: '收起',
                icon: 'icon-up'
            })
        }
    }

    const handleHomeClick = () => {
        Taro.navigateTo({
            url: '/pages/index/index'
        })
    }

    return (
        <View className="videos">
            <NavBar title={video.title} home={true}></NavBar>
            <View className="item">
                <View className="item-video">
                    <Video
                        id='video'
                        style={{ width: '100%' }}
                        src={video.video_path}
                        poster={video.image_path}
                        controls={true}
                        loop={false}
                        muted={false}
                    />
                </View>
                <View className="item-text">
                    <View className="title">{video.title}</View>
                    <Button className="button" openType="share">
                        <Text className="iconfont icon-ArtboardCopy"></Text>
                    </Button>
                </View>
                {
                    folder.fold &&
                    <View className="item-text">
                        <View className="sub-title">{video.description}</View>
                    </View>
                }
                <View className="item-folder" onClick={() => toggleFolder()}>
                    <Text className={classnames('iconfont', folder.icon)}></Text>
                    <Text className="folder-text">{folder.text}</Text>
                </View>
                <View className="video-back view-content" onClick={handleHomeClick}>
                    <Text>点击返回首页</Text>
                </View>
            </View>
        </View>
    )
}

export default VideoDetail