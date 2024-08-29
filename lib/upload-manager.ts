import axios from "axios"
import { APP_SUPPORT_API, KADE_ACCOUNT_ADDRESS } from "../contract"
import delegateManager from "./delegate-manager"
import * as FileSystem from 'expo-file-system'
import { Buffer } from 'buffer'
import posti from "./posti"
import * as MediaLibrary from 'expo-media-library'
import { Alert, Platform } from "react-native"
import { constructConvergenceTransaction, settleConvergenceTransaction } from "../utils/transactions"
import { UploadFileInput } from "./convergence-client/__generated__/graphql"
import { useQuery } from "@apollo/client"
import { uploadFile } from "./convergence-client/queries"
import { convergenceClient } from "../data/apollo"


const cloudfront_url = 'https://dw26fem5oa72i.cloudfront.net/'

type DIMENSIONS = {
    width: number,
    height: number
}

class UploadManager {

    constructor() { }

    async getFileBuffer(uri: string) {
        try {
            const base64String = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64
            })

            const buffer = Buffer.from(base64String, 'base64')

            return buffer
        }
        catch (e) {
            console.log(`SOMETHING WENT WRONG:: ${e}`)
            throw new Error('Unable to get file blob')
        }
    }


    async uploadFile(uri: string, file: Partial<File>, dimesnions?: DIMENSIONS) {
        try {
            const file_buffer = await this.getFileBuffer(uri)

            const account = delegateManager.account

            if (!account || !delegateManager.signer) {
                throw new Error("No account found")
            }

            const response = await convergenceClient.mutate({
                mutation: uploadFile,
                variables:{
                    args: {
                        file_name: file.name,
                        file_type: file.type,
                        file_byte_size: file_buffer.byteLength,
                        delegate_address:  account.address().hex(),
                        dimensions: dimesnions,
                        cdn: true
                    } as UploadFileInput
                }
            })

            const data = response.data
            
            const { file_url, upload_url } = data?.uploadFile ?? {}


            if (!file_url || !upload_url) {
                throw new Error('No URLS were sent down')
            }



            await axios.put(upload_url, file_buffer, {
                headers: {
                    'Content-Type': file.type
                }
            })

            console.log("FILE UPLOADED:: ", file_url)

            return file_url

        }
        catch (e) {
            posti.capture('image-upload-error', {
                user: delegateManager.owner,
                delegate: delegateManager.account?.address().toString(),
                error: 'Unable to upload file'
            })
            console.log(`SOMETHING WENT WRONG:: ${e}`)
            throw new Error('Unable to upload file')
        }
    }

    async downloadFile(uri: string) {
        try {

            const timestamp = new Date().getTime().toString()
            const res = await FileSystem.downloadAsync(uri, `${FileSystem.documentDirectory}${timestamp}.jpg`)
            const { granted } = await MediaLibrary.requestPermissionsAsync()

            if (granted) {

                await MediaLibrary.saveToLibraryAsync(res.uri)
                Alert.alert('Image saved')
            }
        }
        catch (e) {
            console.log(`SOMETHING WENT WRONG:: ${e}`)
            throw new Error('Unable to download file')
        }
    }
}

export default new UploadManager()