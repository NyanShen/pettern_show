import React, { useEffect, useState } from 'react'
import { useShareAppMessage } from '@tarojs/taro'
import { View, Video, Button } from '@tarojs/components'

import app from '@services/request'
import api from '@services/api'
import './index.scss'

const Videos: React.FC = () => {
    const [videos, setVideos] = useState<any[]>([])

    useShareAppMessage((res) => {
      console.log("useShareAppMessage", res)
      return {
          title: '视频案例集',
          path: '/pages/index/index',
          imageUrl: 'http://192.168.2.248/assets/images/1400x933_1.jpg'
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
                            <View className="title">标题分享标题共享</View>
                            <Button className="iconfont icon-ArtboardCopy" openType="share"></Button>
                        </View>
                    </View>
                ))
            }
        </View>
    )
}

export default Videos