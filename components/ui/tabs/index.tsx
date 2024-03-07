import React from 'react'
import { ReactNode } from 'react'
import { Dimensions } from 'react-native'
import { useState } from 'react'
import type { StackProps, TabLayout, TabsTabProps } from 'tamagui'
import {AnimatePresence, SizableText, Tabs, YStack,styled} from 'tamagui'

export const Tab = ({...props}) => {
    const deviceWidth: number = Dimensions.get('window').width

    const numberTabs: number = React.Children.count(props.children)

    const [tabState, setTabState] = useState<{
            currentTab: string
            intentAt: TabLayout | null
            activeAt: TabLayout | null
            prevActiveAt: TabLayout | null
          }>({
            activeAt: null,
            currentTab: props.children[0].props.label,
            intentAt: null,
            prevActiveAt: null,
          })

    const setIntentIndicator = (intentAt:any) => setTabState({ ...tabState, intentAt })

    const setActiveIndicator = (activeAt:any) =>setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt })

    const { activeAt} = tabState

    const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
        if (type === 'select') {
            setActiveIndicator(layout)
        } else {
            setIntentIndicator(layout)
        }
    }

    return (
        <Tabs 
            defaultValue={props.children[0].props.label}
            orientation="horizontal"
            flexDirection="column"
            overflow="hidden"
            width={deviceWidth}>
                 <YStack>
                    <AnimatePresence>
                    {activeAt && (
                        <TabsRovingIndicator
                        theme="active"
                        active
                        width={activeAt.width}
                        height="$0.5"
                        x={activeAt.x}
                        bottom={0}
                        />
                    )}
                    </AnimatePresence>

                    <Tabs.List
                        disablePassBorderRadius="bottom"
                    >
                        {
                            React.Children.map(props.children, (child: ReactNode)=> {
                                if(React.isValidElement(child)) {
                                    const {label} = child.props

                                    return (
                                        <Tabs.Tab
                                            unstyled
                                            paddingHorizontal="$3"
                                            paddingVertical="$2"
                                            maxWidth={deviceWidth/numberTabs} 
                                            minWidth={deviceWidth/numberTabs} 
                                            value={label}
                                            onInteraction={handleOnInteraction}
                                            >
                                            <SizableText> { label } </SizableText>
                                        </Tabs.Tab>
                                    )
                                }
                            })
                        }
                    </Tabs.List>
                </YStack>
                {
                    React.Children.map(props.children, (child: ReactNode)=> {
                        if(React.isValidElement(child)) {
                            const {label} = child.props

                            return (
                                <Tabs.Content value={label}>
                                    {child.props.children}
                                </Tabs.Content>
                            )
                        }
                    })
                    
                }
        </Tabs>
        
    )
}

export const TabSection = (props:{label: string, children: ReactNode}) => {
    return null
}



const TabsRovingIndicator = ({ active, ...props }: { active?: boolean } & StackProps) => {
  return (
    <YStack
      position="absolute"
      backgroundColor="$color5"
      opacity={0.7}
      enterStyle={{
        opacity: 0,
      }}
      exitStyle={{
        opacity: 0,
      }}
      {...(active && {
        backgroundColor: '$color8',
        opacity: 0.6,
      })}
      {...props}
    />
  )
}

export const SlideTab = {
    Root: Tab,
    Section: TabSection
}