import '../global'
import 'react-native-get-random-values'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { Platform, Text, View, useColorScheme } from 'react-native'
import { PortalProvider, TamaguiProvider } from 'tamagui'
import '../tamagui-web.css'
import { config } from '../tamagui.config'
import { useFonts } from 'expo-font'
import { useEffect, useRef } from 'react'
import delegateManager from '../lib/delegate-manager'
import { ApolloProvider } from '@apollo/client'
import client from '../data/apollo'
import { QueryClient, QueryClientProvider } from 'react-query'
import selfModeration from '../lib/self-moderation'
import * as Navigator from 'expo-navigation-bar'
import Toast from 'react-native-toast-message'
import * as Notifications from 'expo-notifications'
import localStore from '../lib/local-store'
import { queryClient } from '../data/query'
import hermes from '../contract/modules/hermes'
import petra from '../lib/wallets/petra'
import settings from '../lib/settings'

// petra.RESTRICTED_resetKeys()
// settings.RESTRICKTED__nuke()

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'onboard',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Initialize the delegate
// TODO: remove this 
// (async () => {
//   await delegateManager.nuke()
//   await localStore.nuke()
//   console.log("DONE NUKING")
// })();



export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    Roboto: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoBold: require('../assets/fonts/roboto/Roboto-Bold.ttf'),
    RobotoMedium: require('../assets/fonts/roboto/Roboto-Medium.ttf'),
    RobotoLight: require('../assets/fonts/roboto/Roboto-Light.ttf'),
    RobotoThin: require('../assets/fonts/roboto/Roboto-Thin.ttf'),
    RobotoBlack: require('../assets/fonts/roboto/Roboto-Black.ttf'),

  })
  const responseListener = useRef();

  useEffect(() => {

    // @ts-expect-error - TS doesn't know about the `current` property
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      // @ts-expect-error - TS doesn't know about the `current` property
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const subscription = async () => {
      return delegateManager.init().then(async () => {
        await selfModeration?.loadMutedUsers()
        await selfModeration?.loadRemovedFromFeed()
        SplashScreen.hideAsync()
      }).catch((e) => {
        console.error("UNABLE TO INITIALIZE DELEGATE", e)
        SplashScreen.hideAsync()

      })
    }
    if (interError || interLoaded) {
      subscription()
    }

    // return () => {
    //   subscription()
    // }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? 'rgb(12,18,34)' : 'rgb(250,250,250)',
        width: '100%',
        height: '100%',
      }}
    >
    </View>
  }



  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (Platform.OS === 'android') {
      Navigator.setBackgroundColorAsync(colorScheme === 'dark' ? '#071E22' : '#071E22')
    }
  }, [colorScheme])

  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config} defaultTheme={"dark"}>
          <ThemeProvider value={DarkTheme}>
            <PortalProvider shouldAddRootHost >


            <Stack
              screenOptions={{
                  headerShown: false,
              }}
                initialRouteName="onboard"
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboard" options={{ headerShown: false }} />
              <Stack.Screen name="connect" options={{ headerShown: false }} />
              <Stack.Screen name="profiles" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="editor" options={{ headerShown: false }} />
                <Stack.Screen name="wallet" options={{ headerShown: false, presentation: 'modal', gestureEnabled: false }} />
                <Stack.Screen name="solid-wallet" options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="composable-editor" options={{headerShown: false}}/>
            </Stack>
            </PortalProvider>
            <Toast autoHide />
          </ThemeProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
