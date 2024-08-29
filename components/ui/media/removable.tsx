import { X } from '@tamagui/lucide-icons';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { XStack, YStack } from 'tamagui';

interface Props {
    children: React.ReactNode;
    removable?: boolean;
    id?: string;
    onRemove?: (id: string) => void;
}

const Removable = (props: Props) => {
    const { children, removable, id, onRemove } = props;
    return (
        <YStack flex={1} w="100%" pos="relative" >
            {removable && <TouchableOpacity
                onPress={() => {
                    id && onRemove && onRemove(id)
                }}
                style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    padding: 5,
                    zIndex: 1000,
                    borderRadius: 100,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }} >
                <X color={'white'} />
            </TouchableOpacity>}
            {children}
        </YStack>
    );
}

export default memo(Removable)
