import React from 'react'
import { View, Video, Button, Text } from '@tarojs/components'
import classnames from 'classnames'

import NavBar from '@components/navbar'
import { getCurrentInstance } from '@tarojs/taro'

const VideoDetail = () => {
    const router = getCurrentInstance().router
    const videoId = router?.params.id

    console.log(videoId)
    const toggleFolder = () => {

    }
    return (
        <View className="video">
            <NavBar title="视频名称" home={true}></NavBar>
            <View className="item">
                <View className="item-video">
                    <Video
                        id='video'
                        style={{ width: '100%' }}
                        src={''}
                        poster={''}
                        controls={true}
                        loop={false}
                        muted={false}
                    />
                </View>
                <View className="item-text">
                    <View className="title">{''}</View>
                    <Button className="button" openType="share">
                        <Text className="iconfont icon-ArtboardCopy"></Text>
                    </Button>
                </View>
                {
                    <View className="item-text">
                        <View className="sub-title">{'item.description'}</View>
                    </View>
                }
                <View className="item-folder" onClick={() => toggleFolder()}>
                    <Text className={classnames('iconfont', 'icon-down')}></Text>
                    <Text className="folder-text">{'展开'}</Text>
                </View>
            </View>
        </View>
    )
}

export default VideoDetail