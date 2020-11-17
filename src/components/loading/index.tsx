import React from 'react'
import { View, Text } from '@tarojs/components'

interface IProps {
    empty?: boolean
    loading: boolean
}

const Loading = (props: IProps) => {
    const { loading, empty = true } = props
    return (
        <View className="loading">
            {
                loading &&
                <View className="empty-container">
                    <Text className="loading">数据加载中......</Text>
                </View>
            }
            {
                empty && !loading &&
                <View className="empty-container">
                    <Text>没有更多数据了</Text>
                </View>
            }
        </View>
    )
}

export default Loading