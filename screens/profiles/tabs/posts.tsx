import { Animated, Platform } from 'react-native'
import React, { memo, useCallback } from 'react'
import { ProfileTabsProps, SceneProps, ScrollManager } from './common'
import { useQuery } from '@apollo/client'
import { GET_PUBLICATIONS } from '../../../utils/queries'
import delegateManager from '../../../lib/delegate-manager'
import { Spinner, Text, View, XStack } from 'tamagui'
import BaseContentContainer from '../../../components/ui/feed/base-content-container'
import PublicationAnimatedFlatlist from './publication-animated-flatlist'


const PostsTab = (props: ProfileTabsProps) => {
  return (
    <PublicationAnimatedFlatlist
      {...props}
      types={[1, 2]}
    />
  )
}

export default memo(PostsTab)