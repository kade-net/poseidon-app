import { View, Text } from 'react-native'
import React, { memo } from 'react'
import { ProfileTabsProps, SceneProps, ScrollManager } from './common'
import PublicationAnimatedFlatlist from './publication-animated-flatlist'


const RepostsTab = (props: ProfileTabsProps) => {
    return (
        <PublicationAnimatedFlatlist
            {...props}
            types={[3, 4]} // COMMENTS AND REPOSTS
        />
    )
}

export default memo(RepostsTab)