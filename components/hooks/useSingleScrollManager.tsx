import { View, Text, Animated } from 'react-native'
import React, { useMemo, useRef } from 'react'

const useSingleScrollManager = () => {
    const scrollY = useRef(new Animated.Value(0)).current

    return useMemo(() => {
        return {
            scrollY
        }
    }, [])
}

export default useSingleScrollManager