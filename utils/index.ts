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
}