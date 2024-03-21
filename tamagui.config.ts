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
      primary: 'rgb(10, 132, 255)',
      background: 'rgb(12,18,34)',
      card: 'rgb(18, 18, 18)',
      text: 'rgb(250,250,250)',
      sideText: 'rgb(151,151,156)',
      border: 'rgb(39, 39, 41)',
      reactionBorderColor:"rgb(151,151,156)",
      reactionTextColor:"rgb(151,151,156)",
      activeReaction: "rgb(196, 20, 134)",
      notification: 'rgb(255, 69, 58)',
      button:'rgb(12,114,183)',
      disabledButton:'rgba(12,114,183,0.5)',
      buttonText:'rgb(250,250,250)',
      COAText:"rgb(12,114,183)",
      colourlessButton: 'rgb(12,18,34)',
      borderColor: 'rgba(151,151,156,0.4)',
      bottomSheet: 'rgb(20, 29, 54)',
      
    },
    light: {
      ...configBase.themes.light,
      primary: 'rgb(10, 132, 255)',
      background: 'rgb(250,250,250)',
      card: 'rgb(18, 18, 18)',
      text: 'rgb(13,12,12)',
      sideText: 'rgb(151,151,156)',
      border: 'rgb(39, 39, 41)',
      reactionBorderColor:"rgb(151,151,156)",
      reactionTextColor:"rgb(151,151,156)",
      activeReaction: "rgb(196, 20, 134)",
      notification: 'rgb(255, 69, 58)',
      button:'rgb(12,114,183)',
      disabledButton:'rgba(12,114,183,0.5)',
      buttonText:'rgb(250,250,250)',
      COAText:"rgb(12,114,183)",
      colourlessButton: 'rgb(250,250,250)',
      borderColor: 'rgba(151,151,156,0.4)',
      bottomSheet: 'rgb(237, 230, 230)',


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

