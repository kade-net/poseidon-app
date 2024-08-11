import { Link, router, useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, H2, H5, Image, SizableText, View, YStack } from 'tamagui'
import petra from '../../../lib/wallets/petra'
import delegateManager from '../../../lib/delegate-manager'
import { User } from '@tamagui/lucide-icons'
import { Text } from 'tamagui'
import account from '../../../contract/modules/account'
import { Utils } from '../../../utils'
import { BackHandler, ImageBackground, useColorScheme } from 'react-native'
import * as Linking from 'expo-linking'
import * as Updates from 'expo-updates'
import posti from '../../../lib/posti'
import BaseButton from '../../../components/ui/buttons/base-button'


const WelcomeScreen = () => {
    const router = useRouter()
    const colorSchem = useColorScheme()

    useEffect(() => {
        (async () => {
            try {
                const update = await Updates.checkForUpdateAsync();

                if (update.isAvailable) {
                    try {
                        await Updates.fetchUpdateAsync();
                    } catch (e) {
                        posti.capture('error fetching update', {
                            error: e ?? 'Unable to trigger update fetch',
                        })
                    }
                } else {

                }
            }
            catch (e) {
                posti.capture('error fetching update', {
                    error: e ?? 'Unable to trigger update fetch',
                })
            }
        })();
    }, [])

    // back handler
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {

                return true
            }

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

            return () => {
                subscription.remove()
            }
        }, [])
    )

    const goToCreateAccount = () => {
      router.replace('/onboard/email')
    }

    const goToSignIn = () => {
        router.replace('/onboard/signin')
    }

    const handleOpenTerms = () => {
        Linking.openURL('https://legal.poseidon.ac/legal/terms-of-service')
    }

    const handleOpenPrivacy = () => {
        Linking.openURL('https://legal.poseidon.ac/legal/privacy-policy')
    }


    return (
      <ImageBackground
        source={require('../../../assets/brand/banner-two.png')}
        resizeMode='cover'
        style={{
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        <View
          w="100%"
          // backgroundColor={"$background"}
          alignItems="center"
          justifyContent="space-between"
          flex={1}
          px={20}
        >
          <View flex={1} w="100%" alignItems="center" justifyContent="center" rowGap={10} >
            <Text textAlign='center' fontSize={48} >
              👋
            </Text>
            <Text>
              welcome to...
            </Text>
            <Text fontSize={32} >
              Poseidon
            </Text>
            {/* <H5>
              Let's begin your Web3 journey!
            </H5> */}
            {/* <View h={80} w={80}>
              <Image
                source={require("../../../assets/brand/logomark/PNG/Kade Logotype_white.png")}
                width={100}
                height={100}
              />
            </View> */}
          </View>

          <YStack w="100%" rowGap={10} pb={20}>
            <View w="100%" rowGap={10}>
              <BaseButton
                // icon={<User color={'white'} size={20} />}
                w="100%"
                type="outlined"
                borderRadius={100}
                onPress={goToSignIn}
                backgroundColor={'$border'}
              >
                <Text color={'white'} >
                  Sign In
                </Text>
              </BaseButton>
              <BaseButton
                w="100%"
                onPress={goToCreateAccount}
                borderRadius={100}
              >
                <Text>
                  Get Started
                </Text>
              </BaseButton>

            </View>
            <Text alignItems="center" textAlign="center" fontSize={"$1"}>
              By creating an account, you agree to our{" "}
              <Text color={"$COAText"} onPress={handleOpenTerms}>
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text onPress={handleOpenPrivacy} color={"$COAText"}>
                Privacy Policy
              </Text>
            </Text>
          </YStack>
        </View>
      </ImageBackground>
    );
}

export default WelcomeScreen
