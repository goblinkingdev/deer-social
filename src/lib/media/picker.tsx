import ExpoImageCropTool, {type OpenCropperOptions} from 'expo-image-crop-tool'
import {type ImagePickerOptions, launchCameraAsync} from 'expo-image-picker'

export {
  openPicker,
  openUnifiedPicker,
  type PickerImage as RNImage,
} from './picker.shared'

export async function openCamera(customOpts: ImagePickerOptions) {
  const opts: ImagePickerOptions = {
    mediaTypes: 'images',
    ...customOpts,
  }
  const res = await launchCameraAsync(opts)

  if (!res || !res.assets) {
    throw new Error('Camera was closed before taking a photo')
  }

  const asset = res?.assets[0]

  return {
    path: asset.uri,
    mime: asset.mimeType ?? 'image/png',
    size: asset.fileSize ?? 0,
    width: asset.width,
    height: asset.height,
    quality: 100,
  }
}

export async function openCropper(opts: OpenCropperOptions) {
  const item = await ExpoImageCropTool.openCropperAsync({
    ...opts,
    format: 'png',
  })

  return {
    path: item.path,
    mime: item.mime,
    size: item.size,
    width: item.width,
    height: item.height,
    quality: 100,
  }
}
