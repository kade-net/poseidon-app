import React, { memo } from 'react'
import { ProfileTabsProps } from './common'
import PublicationAnimatedFlatlist from './publication-animated-flatlist'

const PostsTab = (props: ProfileTabsProps) => {
  return (
    <PublicationAnimatedFlatlist {...props} types={[1, 2]} />
  );
};

export default memo(PostsTab)