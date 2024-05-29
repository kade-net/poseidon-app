import { AccountAddress } from "@aptos-labs/ts-sdk";
import { isEmpty, isString } from "lodash";
import { Dimensions } from "react-native";
const ipfsBaseUri = 'https://cloudflare-ipfs.com/ipfs/'
const NO_COLLECTION_IMAGE = 'https://api.dicebear.com/8.x/shapes/png?seed=collection'

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
    if (!uri || uri.length === 0) return null
    try {
      if (uri.includes('ipfs://')) {
        console.log("IPFsssS::", uri)
      }
      const controller = new AbortController()
      setTimeout(() => {
        console.log("Aborting")
        controller.abort()
      }, 5000)
      const resp = await fetch(uri, { method: 'HEAD', signal: controller.signal })

      const contentType = resp.headers.get('content-type')

      if (!contentType || !contentType.startsWith('image')) {
        return null
      }

      return {
        is_svg: contentType?.includes('image/svg+xml')
      }

    }
    catch (e) {
      return null
    }
  }

  export const getImageData = async (uri: string) => {
    if (!uri || uri.length == 0) return null

    try {
      const controller = new AbortController()
      setTimeout(() => {
        console.log("Aborting")
        controller.abort()
      }, 5000)
      const resp = await fetch(uri, { method: 'GET', signal: controller.signal })
      if (resp.ok) {
        try {
          // TODO: update
          const json: any = await resp.json()
          // console.log("JSON::", json)
          const image: string | null = isString(json?.image) ? json?.image : null
          const imageController = new AbortController()
          setTimeout(() => {
            console.log("Aborting")
            imageController.abort()
          }, 5000)
          const imageResp = image ? await fetch(image, { method: 'HEAD', signal: imageController.signal }) : null
          if (!imageResp) return null
          const contentType = imageResp?.headers.get('content-type')
          if (!contentType) return null

          return {
            image: parseCollectionImage(image),
            is_svg: contentType?.includes('image/svg+xml'),
            is_image: contentType?.includes('image')
          }
        }
        catch (e) {
          return null
        }
      } else {
        return null
      }
    }
    catch (e) {
      return null
    }
  }


  export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/

  export const diceImage = (seed: string) => `https://api.dicebear.com/8.x/pixel-art-neutral/png?seed=${seed ?? '1'}`

  export const extractLinks = (content: string) => {
    const regex = /(?:^|\s)(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*/g
    return content.match(regex)

  }

  export const sleep = (ms: number) => new Promise((res, rej) => {
    setTimeout(res, ms)
  })


  export const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  export const isAptosAddress = (address: string) => {
    const isValid = AccountAddress.isValid({
      input: address
    })

    return isValid.valid && (address?.length === 64 || address?.length === 66)

  }


  export const isValidUsername = (usernaem: string) => {
    return USERNAME_REGEX.test(usernaem)
  }

  export const parseAvatarImage = (address: string, image?: string | null) => {
    if (!image) {
      return diceImage(address)
    }
    if (image.length == 0) {
      return diceImage(address)
    }

    return image
  }

  export const parseCollectionImage = (image: string | null) => {
    const is_ipfs = image?.includes('ipfs://')
    if (is_ipfs && image) {
      return image?.replace('ipfs://', ipfsBaseUri)
    }
    if (!image || image?.length == 0) {
      return NO_COLLECTION_IMAGE
    }

    return image
  }

  export const convertAspectRatio = (aspect_ratio: string) => {
    if (!aspect_ratio || aspect_ratio.length === 0) return 1
    const [width, height] = aspect_ratio.split(':')
    return Number(width) / Number(height)
  }
}