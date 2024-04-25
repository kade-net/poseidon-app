import axios from "axios"
import { APP_SUPPORT_API } from "../contract"
import delegateManager from "./delegate-manager"
import * as FileSystem from 'expo-file-system'
import { Buffer } from 'buffer'
import posti from "./posti"

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
            const response = await axios.post<{ file_url: string, upload_url: string }>(`${APP_SUPPORT_API}/upload`, {
                file_name: file.name,
                file_byte_size: file_buffer.byteLength,
                file_type: file.type,
                delegate_address: delegateManager.account?.address()?.toString(),
                dimesnions
            })

            const data = response.data
            const { file_url, upload_url } = data ?? {}

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
}

export default new UploadManager()