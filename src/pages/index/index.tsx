import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Input, ScrollView, Text } from '@tarojs/components'
import classnames from 'classnames'

import app from '@services/request'
import api from '@services/api'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import Photos from '@components/photos'
import Videos from '@components/videos'
import Articles from '@components/articles'
import './index.scss'

const Index = () => {
  const { appHeaderHeight, contentHeight } = useNavData()
  const [searchTitle, setSearchTitle] = useState<string>('')
  const [scroll, setScroll] = useState<any>({})
  const [navData, setNavData] = useState<any[]>([])
  const [currentType, setCurrentType] = useState<any>('')
  const ref = useRef<any>({})

  useEffect(() => {
    app.request({
      url: app.apiUrl(api.getNewsCate),
      data: {
        status: 1
      }
    }, { loading: false }).then((result: any) => {
      setNavData(result)
      setCurrentType(result[0].type)
    })
  }, [])

  const handleNavClick = (item: any) => {
    setCurrentType(item.type)
  }

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

  const handleScrollToLower = useCallback(() => {
    ref.current.innerFn && ref.current.innerFn()
  }, [])

  const handleInputChange = (e: any) => {
    setSearchTitle(e.detail.value)
  }

  const toTop = () => {
    setScroll({
      top: Math.random(),
      fixed: false,
      style: {}
    })
  }

  const photoTypes = ['4']
  const videoTypes = ['5']
  const articleTypes = ['1', '2', '3', '6']

  const PhotoRender = useMemo(() => (
    <Photos type={currentType} title={searchTitle} ref={ref} />
  ), [currentType, searchTitle])

  const VideoRender = useMemo(() => (
    <Videos type={currentType} title={searchTitle} ref={ref} />
  ), [currentType, searchTitle])

  const ArticleRender = useMemo(() => (
    <Articles type={currentType} title={searchTitle} ref={ref} />
  ), [currentType, searchTitle])

  return (
    <View className="index">
      <NavBar />
      <ScrollView
        scrollY
        style={{ maxHeight: contentHeight }}
        scrollWithAnimation
        scrollTop={scroll.top}
        onScroll={handleScroll}
        lowerThreshold={30}
        onScrollToLower={handleScrollToLower}
      >
        <View className="header">
          <View className="logo"></View>
          <View className="title">国脉房产案例集</View>
        </View>
        <View className="search">
          <View className="search-content">
            <View className="iconfont icon-search"></View>
            <Input className="search-input" placeholder="搜索" onBlur={handleInputChange}></Input>
          </View>
        </View>
        <View className={classnames('indexnav', scroll.fixed && 'fixed')} style={scroll.style}>
          <ScrollView scrollX>
            {
              navData.map((item: any, index: number) => (
                <View
                  key={index}
                  onClick={() => handleNavClick(item)}
                  className={classnames('indexnav-item', currentType === item.type && 'actived')}>
                  <View className="name">{item.title}</View>
                </View>
              ))
            }
          </ScrollView>
        </View>
        <View className="content">
          {photoTypes.includes(currentType) && PhotoRender}
          {videoTypes.includes(currentType) && VideoRender}
          {articleTypes.includes(currentType) && ArticleRender}
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