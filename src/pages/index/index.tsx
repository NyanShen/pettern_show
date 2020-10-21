import React, { useState } from 'react'
import { View, Input, ScrollView, Text } from '@tarojs/components'
import classnames from 'classnames'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import Photos from '@components/photos'
import './index.scss'
import Articles from '@components/articles'

const Index = () => {
  const { appHeaderHeight, contentHeight } = useNavData()
  const [scroll, setScroll] = useState<any>({})
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

  const handleScroll = (e: any) => {
    const top = e.detail.scrollTop
    if (top > 200) {
      setScroll({
        ...scroll,
        fixed: true,
        style: { top: appHeaderHeight }
      })
    }
    if (top <= 200 && scroll.fixed) {
      setScroll({
        ...scroll,
        fixed: false,
        style: {}
      })
    }
  }

  const toTop = () => {
    setScroll({
      top: Math.random(),
      fixed: false,
      style: {}
    })
  }

  const handleNavClick = (item: any) => {
    setCurrentNav(item)
  }

  return (
    <View className="index">
      <NavBar />
      <ScrollView
        scrollY
        style={{ maxHeight: contentHeight }}
        scrollWithAnimation
        scrollTop={scroll.top}
        onScroll={handleScroll}
      >
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
        <View className={classnames('indexnav', scroll.fixed && 'fixed')} style={scroll.style}>
          <ScrollView scrollX>
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
        </View>
        <View className="content">
          {currentNav.englishName === 'Photo' && <Photos />}
          {currentNav.englishName === 'Media' && <Articles />}
        </View>
      </ScrollView>
      <View className="action">
        {
          scroll.fixed &&
          <View className="action-item" onClick={toTop}>
            <View className="item-icon">
              <View>TOP</View>
            </View>
          </View>
        }
        <View className="action-item">
          <View className="item-icon">
            <View className="iconfont icon-telephone-out"></View>
          </View>
          <View className="item-text">
            <Text>联系我们</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
export default Index