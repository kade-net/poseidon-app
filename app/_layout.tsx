import '../global'
import 'react-native-get-random-values'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { Platform, useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
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

delegateManager.init().then(async () => {
  await selfModeration?.loadMutedUsers()
  await selfModeration?.loadRemovedFromFeed()
}).catch((e) => {
  console.error("UNABLE TO INITIALIZE DELEGATE", e)
})
const queryClient = new QueryClient
export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    Roboto: require('../assets/fonts/Roboto-Regular.ttf')
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
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  useEffect(() => {
    if (Platform.OS === 'android') {
      Navigator.setBackgroundColorAsync(colorScheme === 'dark' ? 'rgb(12,18,34)' : 'rgb(250,250,250)')
    }
  }, [colorScheme])

  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config} defaultTheme={colorScheme as any}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                headerShown: false
              }}
              initialRouteName='onboard'
              screenListeners={{
                state: console.log
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboard" options={{ headerShown: false }} />
              <Stack.Screen name="connect" options={{ headerShown: false }} />
              <Stack.Screen name="profiles" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <Toast
              autoHide
            />
          </ThemeProvider> 
        </TamaguiProvider>
      </QueryClientProvider>
    </ApolloProvider>
  )
}
