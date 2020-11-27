import React, { useState } from 'react'
import { useShareAppMessage } from '@tarojs/taro'
import { View, Image, Video, Button, Text } from '@tarojs/components'
import classnames from 'classnames'

import { INewsProps } from '@constants/common'
import './index.scss'

const Videos = (props: INewsProps) => {
    const [folder, setFolder] = useState<boolean>(false)
    const [video, setVideo] = useState<any>({})

    useShareAppMessage((res: any) => {
        const index = res.target.dataset.index
        const target = props.list[index]
        return {
            title: target.title,
            imageUrl: target.image_path,
            path: `/pages/video/index?id=${target.id}&title=${target.title}`
        }
    })

    const toggleFolder = (index: number) => {
        const target = props.list[index]
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
                props.list.map((item: any, index: number) => (
                    <View key={index} className="item">
                        {
                            item.id === video.id ?
                                <View className="item-video">
                                    <Video
                                        id='video'
                                        style={{ width: '100%' }}
                                        src={video.video_path}
                                        controls={true}
                                        loop={false}
                                        muted={false}
                                        autoplay={true}
                                    />
                                </View> :
                                <View className="item-video" onClick={() => setVideo(item)}>
                                    <Image src={item.image_path} mode="aspectFill"></Image>
                                    <View className="iconfont icon-video"></View>
                                </View>
                        }
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