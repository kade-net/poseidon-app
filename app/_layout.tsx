import '../global'
import 'react-native-get-random-values'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { SplashScreen, Stack } from 'expo-router'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import '../tamagui-web.css'
import { config } from '../tamagui.config'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import delegateManager from '../lib/delegate-manager'
import { ApolloProvider } from '@apollo/client'
import client from '../data/apollo'
import { QueryClient, QueryClientProvider } from 'react-query'
import selfModeration from '../lib/self-moderation'

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
          </ThemeProvider> 
        </TamaguiProvider>
      </QueryClientProvider>
    </ApolloProvider>
  )
}
