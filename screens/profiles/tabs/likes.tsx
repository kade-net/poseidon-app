import { View, Text } from 'react-native'
import React from 'react'
import { ProfileTabsProps, SceneProps, ScrollManager } from './common'
import PublicationAnimatedFlatlist from './publication-animated-flatlist'


const LikesTab = (props: ProfileTabsProps) => {
    return (
        <PublicationAnimatedFlatlist
            {...props}
            types={[1, 2]}
            reaction={1} // 1 for like
        />
    )
}

export default LikesTab