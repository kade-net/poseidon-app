import { Dimensions } from "react-native";

export namespace Utils {
    export function dynamicHeight(percentage: number): number {
        const deviceHeight = Dimensions.get('screen').height
        if (percentage < 0 || percentage > 100) {
          throw new Error('Percentage must be between 0 and 100.');
        }
        
        return (deviceHeight * percentage) / 100;
    }

    export function dynamicWidth(percentage: number): number {
        const deviceHeight = Dimensions.get('screen').width
        if (percentage < 0 || percentage > 100) {
          throw new Error('Percentage must be between 0 and 100.');
        }
        
        return (deviceHeight * percentage) / 100;
    }


  export const mentionRegex = /@\w+/g;

  export const urlRegex = /https?:\/\/[^\s]+/g;

  export const validateImageUri = async (uri: string) => {
    if (!uri || uri.length === 0) return false
    try {
      const resp = await fetch(uri, { method: 'HEAD' })

      const contentType = resp.headers.get('content-type')

      if (!contentType || !contentType.startsWith('image')) {
        return false
      }

      return true

    }
    catch (e) {
      return false
    }
  }


  export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

  export const diceImage = (seed: string) => `https://api.dicebear.com/8.x/identicon/png?seed=${seed ?? '1'}`

  export const extractLinks = (content: string) => {
    const regex = /(?:^|\s)(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*/g
    return content.match(regex)

  }

  export const sleep = (ms: number) => new Promise((res, rej) => {
    setTimeout(res, ms)
  })
}