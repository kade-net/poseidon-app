import { createFont, createTamagui} from 'tamagui'
import { config as configBase } from '@tamagui/config'

const roboto = createFont({
  family: 'Roboto',
  size: {
      xxs: 12,
      xs: 14,
      sm: 16,
      md: 18,
      lg: 21,
      xl: 24,
      '2xl': 27,
      '3xl': 36,
      true: 17
  },
  weight: {
    1: "300",
      2: "400",
      3: "500",
      true:"400",
      4: "600",
      5: "700",
      6:"800"
  },
  lineHeight:{
    sm:20

  },
})

export const config = createTamagui({
  ...configBase,
  themes:{
    ...configBase.themes,
    dark:{
      ...configBase.themes.dark,
      primary: '#266DD3',
      baseBackround: configBase.themes.dark.background,
      background: '#071E22',
      card: 'rgb(18, 18, 18)',
      text: 'rgb(250,250,250)',
      sideText: '#148BA0',
      border: '#0A2D33',
      reactionBorderColor:"rgb(151,151,156)",
      reactionTextColor:"rgb(151,151,156)",
      activeReaction: "rgb(196, 20, 134)",
      notification: 'rgb(255, 69, 58)',
      button: '#266DD3',
      lightButton: '#0E434D',
      disabledButton:'rgba(12,114,183,0.5)',
      buttonText:'rgb(250,250,250)',
      COAText:"rgb(12,114,183)",
      colourlessButton: 'rgb(12,18,34)',
      borderColor: 'rgba(151,151,156,0.4)',
      bottomSheet: 'rgb(20, 29, 54)',
      searchBar: '#3c3c3e',
      incomingChatBubble:"#3c3c3e",
      portalBackground: '#2a2432',
      portalButton: '#ffffff1a',
      portalBorderColor: '#4c3a4e80',
      inputBackground: '#08171A',
    },
    light: {
      ...configBase.themes.light,
      primary: '#266DD3',
      background: '#ffffff',
      card: 'rgb(18, 18, 18)',
      text: 'rgb(13,12,12)',
      sideText: '#148BA0',
      border: 'rgb(39, 39, 41)',
      reactionBorderColor:"rgb(151,151,156)",
      reactionTextColor:"rgb(151,151,156)",
      activeReaction: "rgb(196, 20, 134)",
      notification: 'rgb(255, 69, 58)',
      button: '#266DD3',
      lightButton: '#0E434D',
      disabledButton:'rgba(12,114,183,0.5)',
      buttonText:'rgb(250,250,250)',
      COAText:"rgb(12,114,183)",
      colourlessButton: 'rgb(250,250,250)',
      borderColor: 'rgba(151,151,156,0.4)',
      bottomSheet: 'rgb(237, 230, 230)',
      baseBackround: configBase.themes.light.background,
      searchBar: '#d5d5d7',
      incomingChatBubble:"#d5d5d7",
      portalBackground: '#f5f6f9',
      portalButton: '#cccfd9',
      portalBorderColor: '#f1f5f9',
      inputBackground: '#08171A'
    }
  },
  fonts: {
    ...configBase.fonts,
    roboto: {
      ...roboto,
      size: {
        ...roboto.size,
        ...configBase.fonts.body.size
      }
    },
    body: {
      ...roboto,
      size: {
        ...roboto.size,
        ...configBase.fonts.body.size
      }
    },
    heading: {
      ...roboto,
      size: {
        ...roboto.size,
        ...configBase.fonts.body.size
      }
    }
  },
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}


export default config

