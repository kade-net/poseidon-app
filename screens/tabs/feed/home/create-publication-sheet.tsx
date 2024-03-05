import React, { useState } from 'react'
import { View, Text, Sheet, Button, Separator, ScrollView, TextArea } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import FeedImage from '../../../../components/ui/feed/image'
import { KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import { ImagePlus } from '@tamagui/lucide-icons'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TPUBLICATION, publicationSchema } from '../../../../schema'
import uploadManager from '../../../../lib/upload-manager'
import publications from '../../../../contract/modules/publications'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreatePublicationSheet = (props: Props) => {
  const { open: isEditorOpen, onOpenChange } = props
  const insets = useSafeAreaInsets()

  const [images, setImages] = useState<Array<ImagePicker.ImagePickerAsset>>([])
  const form = useForm<TPUBLICATION>({
    resolver: zodResolver(publicationSchema)
  })

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // TODO: Add support for videos
      allowsEditing: true,
      quality: 1
    })



    if (!result.canceled) {
      const chosen = result.assets ?? []
      setImages((prev) => {
        return [...prev, ...chosen]
      })
      const existingMedia = form.getValues('media') ?? []

      if (chosen.length > 0) {
        const assets = await Promise.all(chosen.map(async (asset) => {
          const upload = await uploadManager.uploadFile(asset.uri, {
            type: asset.type,
            name: asset.fileName ?? "publication-image",
            size: asset.fileSize ?? 0
          })
          return {
            type: asset.type ?? 'image',
            url: upload
          }
        }))



        form.setValue('media',
          [
            ...existingMedia,
            ...assets
          ]
        )
      }
    }
  }


  const handlePublish = async (values: TPUBLICATION) => {
    try {
      console.log('Publishing', values)
      const txn = await publications.createPublication(values)

      console.log('Published', txn)


    }
    catch (e) {
      console.log('Error publishing', e)
    }
  }


  return (
    <Sheet
      open={isEditorOpen}
      snapPoints={[100]}
      position={0}
      onOpenChange={onOpenChange}
      animation={'medium'}
      zIndex={100_000}
      dismissOnSnapToBottom
      modal
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}

      />
      <Sheet.Frame
        pt={insets.top}
        pb={insets.bottom}
      >
        <View
          flexDirection='row'
          alignItems='center'
          justifyContent='space-between'
          py={5}
          px={10}
        >
          <Button
            onPress={() => {
              onOpenChange(false)
            }}
            w={100} variant='outlined' >
            Cancel
          </Button>

          <Button onPress={form.handleSubmit(handlePublish, console.log)} w={100} >
            Post
          </Button>
        </View>
        <Separator />
        <ScrollView flex={1} w="100%" rowGap={20} px={10} >
          <Controller
            control={form.control}
            name='content'
            render={({ field }) => {
              return (
                <TextArea
                  outlineWidth={0}
                  borderWidth={0}
                  placeholder='What is on your mind?'
                  autoFocus
                  value={field.value}
                  onChangeText={field.onChange}
                />
              )

            }}
          />
          <View w="100%" flexDirection='row' flexWrap='wrap' px={20} rowGap={5} columnGap={5} >
            {
              images.map((image, index) => {
                return (
                  <View
                    width={
                      images.length > 1 ? (
                        "40%"
                      ) : ("80%")
                    }
                    key={index}
                  >
                    <FeedImage
                      image={image.uri}
                      editable
                      id={index}
                      onRemove={(id) => {
                        console.log('removing', id, index)
                        setImages((prev) => {
                          return prev.filter((_, i) => i !== id)
                        })
                      }}
                    />

                  </View>
                )
              })
            }
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          style={{
            width: '100%',
          }}
        >

          <View
            w="100%"
            flexDirection='row'
            px={20}
            py={5}
            bg={'$gray1'}
          >
            <TouchableOpacity
              onPress={handleChooseImage}
            >
              <ImagePlus />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Sheet.Frame>
    </Sheet>
  )
}

export default CreatePublicationSheet