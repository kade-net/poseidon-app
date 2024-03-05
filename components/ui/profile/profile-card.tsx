import { View, Text, Avatar } from 'tamagui'
import React from 'react'

const ProfileCard = (props: Entities.Profile) => {
    const profile = props
    return (
        <View
            flexDirection='row'
            columnGap={10}
            p={10}
        >
            <View
                h="100%"
                w="10%"
            >
                <Avatar circular size={"$3"} >
                    <Avatar.Image
                        src={profile?.pfp}
                        accessibilityLabel="Profile Picture"
                    />
                    <Avatar.Fallback
                        backgroundColor="$pink10"
                    />
                </Avatar>
            </View>
            <View w="90%" rowGap={20} >
                <View flexDirection="row" alignItems="center" justifyContent="space-between" >
                    <View flexDirection="row" alignItems="flex-start" columnGap={10}>
                        <View>
                            <Text>
                                {profile?.display_name}
                            </Text>
                            <Text fontSize={'$1'} color={'$gray10'} >
                                @{profile?.username}
                            </Text>
                        </View>

                    </View>
                    <View>

                    </View>
                </View>
                {/* Bio */}
                <View w="100%" >
                    <Text>
                        {profile?.bio}
                    </Text>
                </View>


            </View>
        </View>
    )
}

export default ProfileCard