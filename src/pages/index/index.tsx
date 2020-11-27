import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Input, ScrollView, Image, Text } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import Photos from '@components/photos'
import Videos from '@components/videos'
import Articles from '@components/articles'
import useNavData from '@hooks/useNavData'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import { INewsParam, INIT_NEWS_PARAM } from '@constants/common'
import './index.scss'
import Loading from '@components/loading'

const PAGE_LIMIT = 20
const poster_url = 'https://case.xyrx.com/static/www/images/share.jpg'

const Index = () => {
  const { contentHeight } = useNavData()
  const [page, setPage] = useState<IPage>(INIT_PAGE)
  const [param, setParam] = useState<INewsParam>(INIT_NEWS_PARAM)
  const [poster, setPoster] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [showEmpty, setShowEmpty] = useState<boolean>(false)
  const [scroll, setScroll] = useState<any>({})
  const [listData, setListData] = useState<any[]>([])
  const [navData, setNavData] = useState<any[]>([])

  useEffect(() => {
    app.request({
      url: app.apiUrl(api.getNewsCate),
      data: {
        status: 1,
        module_id: 1
      }
    }, { loading: false }).then((result: any) => {
      const initData = result[0]
      setNavData(result)
      setParam({
        ...param,
        type: initData.type,
        module: initData.module
      })
    })
  }, [])

  useEffect(() => {
    if (param.type) {
      setLoading(true)
      app.request({
        url: app.apiUrl(api.newsList),
        data: {
          page: param.currentPage,
          limit: PAGE_LIMIT,
          type: param.type,
          title: param.title,
          module_id: 1
        }
      }, { loading: false }).then((result: any) => {
        setLoading(false)
        const totalPage = getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
        setShowEmpty(totalPage <= INIT_NEWS_PARAM.currentPage)
        setPage({
          totalCount: result.pagination.totalCount,
          totalPage
        })
        if (param.currentPage === 1) {
          setListData(result.data)
        } else {
          setListData([...listData, ...result.data])
        }
      })
    }
  }, [param.type, param.title, param.currentPage])

  const handleInputBlur = (e: any) => {
    setParam({
      ...param,
      title: e.detail.value,
      currentPage: INIT_NEWS_PARAM.currentPage
    })
  }

  const handleNavClick = (item: any) => {
    if (item.type === param.type) {
      return
    }
    setListData([])
    setParam({
      title: '',
      type: item.type,
      module: item.module,
      currentPage: INIT_NEWS_PARAM.currentPage
    })
  }

  const handleScrollToLower = useCallback(() => {
    if (page.totalPage > param.currentPage) {
      setParam({
        ...param,
        currentPage: param.currentPage + 1
      })
    } else {
      setShowEmpty(true)
    }
  }, [page.totalPage, param.currentPage])

  const toTop = () => {
    setScroll({
      top: Math.random(),
      fixed: false,
      style: {}
    })
  }

  const handleScroll = (e: any) => {
    const top = e.detail.scrollTop
    if (top > 200) {
      setScroll({
        ...scroll,
        fixed: true,
        style: { top: 0 }
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

  const module_config = useMemo(() => {
    return {
      'image': <Photos key={0} list={listData} type="photo" />,
      'big-image': <Photos key={1} list={listData} type="design" />,
      'video': <Videos key={0} list={listData} />,
      'article': <Articles key={0} list={listData} />
    }
  }, [listData])

  const renderLoading = () => useMemo(() => {
    return <Loading loading={loading} empty={showEmpty}></Loading>
  }, [loading, showEmpty])

  return (
    <View className="index">
      <ScrollView
        scrollY
        style={{ maxHeight: contentHeight }}
        scrollWithAnimation
        scrollTop={scroll.top}
        onScroll={handleScroll}
        lowerThreshold={20}
        onScrollToLower={handleScrollToLower}
      >
        <View className="header">
          <View className="logo"></View>
          <View className="title">国脉房产案例集</View>
        </View>
        <View className="search">
          <View className="search-content">
            <View className="iconfont icon-search"></View>
            <Input className="search-input" placeholder="搜索" onBlur={handleInputBlur} value={param.title}></Input>
          </View>
        </View>
        <View className={classnames('indexnav', scroll.fixed && 'fixed')} style={scroll.style}>
          <ScrollView scrollX>
            {
              navData.map((item: any, index: number) => (
                <View
                  key={index}
                  onClick={() => handleNavClick(item)}
                  className={classnames('indexnav-item', param.type === item.type && 'actived')}>
                  <View className="name">{item.title}</View>
                </View>
              ))
            }
          </ScrollView>
        </View>
        <View className="content">
          {module_config[param.module]}
          {renderLoading()}
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
          param.module === 'image' &&
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