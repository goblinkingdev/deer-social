import {
  type Action,
  type ActionCrop,
  type ImageResult,
  manipulateAsync,
  SaveFormat,
  type SaveOptions,
} from 'expo-image-manipulator'
import {encode} from '@jsquash/webp'
import {nanoid} from 'nanoid/non-secure'

import {POST_IMG_MAX} from '#/lib/constants'
import {getImageDim} from '#/lib/media/manip'
import {type PickerImage} from '#/lib/media/picker.shared'
import {getDataUriSize} from '#/lib/media/util'
import {resize} from '../../node_modules/expo-image-manipulator/src/web/actions/index.web'

export type ImageTransformation = {
  crop?: ActionCrop['crop']
}

export type ImageMeta = {
  path: string
  width: number
  height: number
  mime: string
}

export type ImageSource = ImageMeta & {
  id: string
}

type ComposerImageBase = {
  alt: string
  source: ImageSource
}
type ComposerImageWithoutTransformation = ComposerImageBase & {
  transformed?: undefined
  manips?: undefined
}
type ComposerImageWithTransformation = ComposerImageBase & {
  transformed: ImageMeta
  manips?: ImageTransformation
}

export type ComposerImage =
  | ComposerImageWithoutTransformation
  | ComposerImageWithTransformation

export async function createComposerImage(
  raw: ImageMeta,
): Promise<ComposerImageWithoutTransformation> {
  return {
    alt: '',
    source: {
      id: nanoid(),
      path: raw.path,
      width: raw.width,
      height: raw.height,
      mime: raw.mime,
    },
  }
}

export type InitialImage = {
  uri: string
  width: number
  height: number
  altText?: string
}

export function createInitialImages(
  uris: InitialImage[] = [],
): ComposerImageWithoutTransformation[] {
  return uris.map(({uri, width, height, altText = ''}) => {
    return {
      alt: altText,
      source: {
        id: nanoid(),
        path: uri,
        width: width,
        height: height,
        mime: 'image/png',
      },
    }
  })
}

export async function pasteImage(
  uri: string,
): Promise<ComposerImageWithoutTransformation> {
  const {width, height} = await getImageDim(uri)
  const match = /^data:(.+?);/.exec(uri)

  return {
    alt: '',
    source: {
      id: nanoid(),
      path: uri,
      width: width,
      height: height,
      mime: match ? match[1] : 'image/png',
    },
  }
}

export async function cropImage(img: ComposerImage): Promise<ComposerImage> {
  return img
}

export async function manipulateImage(
  img: ComposerImage,
  trans: ImageTransformation,
): Promise<ComposerImage> {
  const rawActions: (Action | undefined)[] = [trans.crop && {crop: trans.crop}]

  const actions = rawActions.filter((a): a is Action => a !== undefined)

  if (actions.length === 0) {
    if (img.transformed === undefined) {
      return img
    }

    return {alt: img.alt, source: img.source}
  }

  const source = img.source
  const result = await manipulateAsync(source.path, actions, {
    format: SaveFormat.PNG,
  })

  return {
    alt: img.alt,
    source: img.source,
    transformed: {
      path: result.uri,
      width: result.width,
      height: result.height,
      mime: 'image/png',
    },
    manips: trans,
  }
}

export function resetImageManipulation(
  img: ComposerImage,
): ComposerImageWithoutTransformation {
  if (img.transformed !== undefined) {
    return {alt: img.alt, source: img.source}
  }

  return img
}

export async function compressImage(img: ComposerImage): Promise<PickerImage> {
  const source = img.transformed || img.source
  const originalSize = getDataUriSize(img.source.path)

  const [w, h] = containImageRes(source.width, source.height, POST_IMG_MAX)

  let maxQualityPercentage =
    110 - (originalSize >= POST_IMG_MAX.size * 2 ? 10 : 0)
  let newDataUri

  while (maxQualityPercentage > 1) {
    const qualityPercentage = Math.round(maxQualityPercentage - 10)

    const res = await manipulateWebp(source.path, {
      compress: qualityPercentage,
      format: SaveFormat.WEBP,
      resize: {width: w, height: h},
    })

    if (res.size <= POST_IMG_MAX.size && res.size <= originalSize) {
      newDataUri = {
        path: res.uri,
        width: res.width,
        height: res.height,
        mime: 'image/webp',
        size: res.size,
        quality: qualityPercentage,
      }
      break
    } else {
      maxQualityPercentage = qualityPercentage
    }
  }

  if (newDataUri) {
    return newDataUri
  }

  throw new Error(`Unable to compress image`)
}

export const manipulateWebp = async (
  uri: string,
  saveOptions: SaveOptions & {
    resize?: {width: number; height: number}
    method?: number
  } = {},
): Promise<ImageResult & {size: number}> => {
  const img = document.createElement('img')
  img.src = uri
  await new Promise(resolve => {
    img.onload = resolve
  })
  const canvas = document.createElement('canvas')
  ;[canvas.width, canvas.height] = [img.width, img.height]
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.drawImage(img, 0, 0)

  if (saveOptions.resize) {
    resize(canvas, saveOptions.resize)
  }

  const rawImageData = ctx.getImageData(0, 0, img.width, img.height)

  const webpBuffer = await encode(rawImageData, {
    lossless: saveOptions.compress === 100 ? 1 : 0,
    quality: saveOptions.compress || 100,
    method: saveOptions.method || 4,
  })

  const blob = new Blob([webpBuffer], {type: 'image/webp'})
  const resultUri = URL.createObjectURL(blob)

  return {
    uri: resultUri,
    width: rawImageData.width,
    height: rawImageData.height,
    size: blob.size,
  }
}

function containImageRes(
  w: number,
  h: number,
  {width: maxW, height: maxH}: {width: number; height: number},
): [width: number, height: number] {
  let scale = 1

  if (w > maxW || h > maxH) {
    scale = w > h ? maxW / w : maxH / h
    w = Math.floor(w * scale)
    h = Math.floor(h * scale)
  }

  return [w, h]
}

export async function purgeTemporaryImageFiles() {
  return null
}
