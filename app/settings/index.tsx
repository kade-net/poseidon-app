import { View, Text } from 'react-native'
import React from 'react'
import delegateManager from '../../lib/delegate-manager'
import { Button } from 'tamagui'

const Settings = () => {
    const nuke = async () => {
        await delegateManager.nuke()
    }
    return (
        <View>
            <Button
                onPress={nuke}
            >
                Nuke Stuff
            </Button>
        </View>
    )
}

export default Settings