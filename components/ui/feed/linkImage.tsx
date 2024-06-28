import { Image, View } from "tamagui";
import { useQuery } from 'react-query';
import { Dimensions } from "react-native";

interface LinkImageProps {
    url: string
}
const LinkImage = (props: LinkImageProps) =>{
    const getSize = async (image: string) => {
        return new Promise<{ width: number, height: number }>((res, rej) => {
            Image.getSize(image, (width, height) => {
                res({ width, height })
            }, (error) => {
                rej(error)
            })
        })
    }

    const DEVICE_HEIGHT = Dimensions.get('screen').height
    const DEVICE_WIDTH = Dimensions.get('screen').width - 40
    const maxHeight =  DEVICE_HEIGHT * 0.25

    const { data: aspectRatio} = useQuery({
        queryKey: ['aspectRatio:feed', props.url],
        queryFn: async () => {

            const { width, height } = await getSize(props.url)
            const aspect_ratio = width / height

            const DISPLAY_HEIGHT = DEVICE_WIDTH / aspect_ratio

            return {
                aspect_ratio,
                width,
                height,
                is_large: DISPLAY_HEIGHT > maxHeight
            }

        },
    })

    if (!aspectRatio) return null

    
    return(
        <View
            position='relative'
            flex={1}
            aspectRatio={aspectRatio?.is_large ? undefined : aspectRatio?.aspect_ratio}
            width={"100%"}
            height={aspectRatio?.is_large ? maxHeight : "100%"}
            borderRadius={5}
            overflow='hidden'
        >
            <Image
                w="100%"
                resizeMode={
                    aspectRatio?.is_large ? 'cover' : 'contain'
                }
                source={{ uri: props.url }}
                style={{
                    width: '100%',
                    height: '100%',
                    aspectRatio: aspectRatio?.is_large ? undefined : aspectRatio?.aspect_ratio
                }}
                borderTopLeftRadius={9}
                borderTopRightRadius={9}
                mb={10}

            />
        </View>
    )
}

export default LinkImage;