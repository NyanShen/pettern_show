import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import useNavData from '@hooks/useNavData'
import assign from 'lodash/assign'
import classnames from 'classnames'
import './index.scss'

interface IProps {
    title?: string,
    home?: boolean,
    back?: boolean,
    iconOther?: boolean,
    backgroundColor?: string,
    color?: string,
    icon?: string,
    iconClass?: string,
    iconStyle?: any,
    callback?: () => void;
}

const NavBar = (props: IProps) => {
    const defaultProps = {
        title: '',
        home: false,
        back: false,
        iconOther: false,
        backgroundColor: '#ffffff',
        color: '#333',
        icon: '', //\ue608, home ；\ue685 ,back
        iconClass: '',
        iconStyle: null
    }
    props = assign({}, defaultProps, props)
    const { statusBarHeight, titleBarHeight, appHeaderHeight } = useNavData()
    const style = {
        paddingTop: `${statusBarHeight}px`,
        height: `${titleBarHeight}px`,
        backgroundColor: props.backgroundColor,
        color: props.color
    }

    const handleHomeClick = () => {
        Taro.navigateTo({
            url: '/pages/index/index'
        })
    }

    const handleBackClick = () => {
        Taro.navigateBack()
    }

    const { home, back, iconOther, iconClass, iconStyle, icon } = props;

    return (
        <View style={{ height: appHeaderHeight }}>
            <View className="navbar" style={style}>
                {home && <View className="iconfont icon-home" onClick={() => handleHomeClick()}></View>}
                {back && <View className="iconfont icon-arrow-left-bold back" onClick={() => handleBackClick()}></View>}
                {iconOther && <View className={classnames('iconfont', iconClass)} style={iconStyle} onClick={props.callback}>{icon}</View>}
                <View className="navbar-title">{props.title}</View>
            </View>
        </View>
    )
}

export default NavBar
