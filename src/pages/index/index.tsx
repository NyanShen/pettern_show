import React, { useState } from 'react'
import { View, Input, ScrollView } from '@tarojs/components'
import classnames from 'classnames'

import './index.scss'
import NavBar from '@components/navbar'

const Index = () => {

  const [currentNav, setCurrentNav] = useState<any>({
    id: '1',
    chineseName: '图集',
    englishName: 'Photo'
  })

  const navData = [
    {
      id: '1',
      chineseName: '图集',
      englishName: 'Photo'
    },
    {
      id: '2',
      chineseName: '视屏',
      englishName: 'Video'
    },
    {
      id: '3',
      chineseName: '策划',
      englishName: 'Planning'
    },
    {
      id: '4',
      chineseName: '媒体',
      englishName: 'Media'
    },
    {
      id: '5',
      chineseName: '设计',
      englishName: 'Design'
    }
  ]

  const handleNavClick = (item: any) => {
    setCurrentNav(item)
  }

  return (
    <View className="index">
      <NavBar />
      <View className="header">
        <View className="logo">logo</View>
        <View className="title">图集视频案例</View>
      </View>
      <View className="search">
        <View className="search-content">
          <View className="iconfont icon-search"></View>
          <Input className="search-input" placeholder="搜索"></Input>
        </View>
      </View>
      <ScrollView className="indexnav" scrollX>
        {
          navData.map((item: any, index: number) => (
            <View
              key={index}
              onClick={() => handleNavClick(item)}
              className={classnames('indexnav-item', currentNav.id === item.id && 'actived')}>
              <View className="chinese-name">{item.chineseName}</View>
              <View className="english-name">{item.englishName}</View>
            </View>
          ))
        }
      </ScrollView>
      <View className="content view-content">
      </View>
    </View>
  )
}
export default Index