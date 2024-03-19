import { View, Text, Sheet } from 'tamagui'
import React, { memo } from 'react'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    snapPoints?: Array<number>,
    level?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    children: React.ReactNode
    showOverlay?: boolean
    animation?: 'quick' | 'lazy' | 'medium' | 'none' | 'slow'
    dismissOnOverlayPress?: boolean
}
const BaseContentSheet = (props: Props) => {
    const { open, onOpenChange, snapPoints, level = 1, children, showOverlay = true, animation, dismissOnOverlayPress = true } = props

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
        >
            <Sheet.Overlay
                animation={"lazy"}
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
                bg={showOverlay == false ? '$colorTransparent' : undefined}
            />

            <Sheet.Frame backgroundColor={"$bottomSheet"}>
                {children}
            </Sheet.Frame>
        </Sheet>
    )
}

export default memo(BaseContentSheet)