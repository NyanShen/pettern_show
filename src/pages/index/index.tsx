import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, ScrollView, Image, Text } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import Photos from '@components/photos'
import Videos from '@components/videos'
import Articles from '@components/articles'
import useNavData from '@hooks/useNavData'
import { INewsParam } from '@constants/common'
import './index.scss'

const poster_url = 'https://case.xyrx.com/static/www/images/share.jpg'
const Index = () => {
  const { appHeaderHeight, contentHeight } = useNavData()
  const [searchTitle, setSearchTitle] = useState<string>('')
  const [scroll, setScroll] = useState<any>({})
  const [navData, setNavData] = useState<any[]>([])
  const [currentNav, setCurrentNav] = useState<any>({})
  const [poster, setPoster] = useState<boolean>(false)
  const ref = useRef<any>({})

  useEffect(() => {
    app.request({
      url: app.apiUrl(api.getNewsCate),
      data: {
        status: 1,
        module_id: 1
      }
    }, { loading: false }).then((result: any) => {
      setNavData(result)
      setCurrentNav(result[0])
    })
  }, [])

  const handleNavClick = (item: any) => {
    setCurrentNav(item)
    setSearchTitle('')
    ref.current.onParamChange && ref.current.onParamChange(item.type)
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
    ref.current.onScorllToLower && ref.current.onScorllToLower()
  }, [])

  const handleInputBlur = (e: any) => {
    setSearchTitle(e.detail.value)
    ref.current.onParamChange && ref.current.onParamChange(currentNav.type, e.detail.value)
  }

  const toTop = () => {
    setScroll({
      top: Math.random(),
      fixed: false,
      style: {}
    })
  }

  const generatePoster = () => {
    Taro.showLoading({
      title: '生成海报中......',
      mask: true
    })
    setTimeout(() => {
      setPoster(true)
      Taro.hideLoading()
    }, 1000)
  }

  const handleSavePoster = () => {
    Taro.getSetting({
      success: (res) => {
        if (res.authSetting['scope.writePhotosAlbum']) {
          posterHandler()
        } else {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              posterHandler()
            }
          })
        }
      }
    })
  }

  const posterHandler = () => {
    Taro.downloadFile({
      url: poster_url,
      success: (res) => {
        if (res.statusCode === 200) {
          Taro.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              Taro.showToast({
                title: '保存成功',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  }

  const INIT_NEWS_PARAM: INewsParam = {
    type: currentNav.type,
    title: '',
    currentPage: 1,
  }

  const module_config = useMemo(() => {
    return {
      'image': <Photos {...INIT_NEWS_PARAM} ref={ref} />,
      'video': <Videos {...INIT_NEWS_PARAM} ref={ref} />,
      'article': <Articles {...INIT_NEWS_PARAM} ref={ref} />
    }
  }, [currentNav.type])

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
            <Input className="search-input" placeholder="搜索" onBlur={handleInputBlur} value={searchTitle}></Input>
          </View>
        </View>
        <View className={classnames('indexnav', scroll.fixed && 'fixed')} style={scroll.style}>
          <ScrollView scrollX>
            {
              navData.map((item: any, index: number) => (
                <View
                  key={index}
                  onClick={() => handleNavClick(item)}
                  className={classnames('indexnav-item', currentNav.type === item.type && 'actived')}>
                  <View className="name">{item.title}</View>
                </View>
              ))
            }
          </ScrollView>
        </View>
        <View className="content">
          {module_config[currentNav.module]}
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
        {
          currentNav.module === 'image' &&
          <View className="action-item" onClick={generatePoster}>
            <View className="item-icon">
              <View className="iconfont icon-picture"></View>
            </View>
            <View className="item-text">生成海报</View>
          </View>
        }
      </View>
      {
        poster &&
        <View className="poster">
          <View className="mask show" onClick={() => setPoster(false)}></View>
          <View className="poster-content">
            <View className="poster-image">
              <Image src={poster_url} mode="widthFix"></Image>
            </View>
            <View className="btn btn-blue" onClick={handleSavePoster}>
              <Text>保存海报</Text>
            </View>
          </View>
        </View>
      }
    </View>
  )
}

export default Index