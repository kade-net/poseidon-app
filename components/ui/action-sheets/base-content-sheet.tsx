import { View, Text } from 'tamagui'
import React, { memo } from 'react'
import { Sheet } from '@tamagui/sheet'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    snapPoints?: Array<number>,
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    children: React.ReactNode
    showOverlay?: boolean
    animation?: 'quick' | 'lazy' | 'medium' | 'none' | 'slow'
    dismissOnOverlayPress?: boolean
    containerComponent?: (props: any) => any
    disableDrag?: boolean
}
const BaseContentSheet = (props: Props) => {
    const { open, onOpenChange, snapPoints, level = 1, children, showOverlay = true, animation, dismissOnOverlayPress = true, containerComponent, disableDrag = false } = props

    return (
        <Sheet
            snapPoints={snapPoints ?? [100]}
            dismissOnOverlayPress={dismissOnOverlayPress}
            animationConfig={{
                type: 'timing',
                duration: 400
            }}
            open={open}
            onOpenChange={onOpenChange}
            animation={animation == 'none' ? undefined : animation ?? 'quick'}
            zIndex={level * 100_000}
            dismissOnSnapToBottom
            modal
            unmountChildrenWhenHidden
            containerComponent={containerComponent}
            disableDrag={disableDrag}
        >
            <Sheet.Overlay
                animation={"lazy"}
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                backgroundColor={showOverlay !== undefined && showOverlay == false ? "rgba(0,0,0,0.1)" : undefined}
            />

            <Sheet.Frame backgroundColor={"$background"}>
                {children}
            </Sheet.Frame>
        </Sheet>
    )
}

export default memo(BaseContentSheet)