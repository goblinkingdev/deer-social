/// <reference lib="dom" />

import {encode} from '@jsquash/webp'

import {type PickerImage} from './picker.shared'
import {type Dimensions} from './types'
import {blobToDataUri, getDataUriSize} from './util'
import {mimeToExt} from './video/util'

export async function compressIfNeeded(
  img: PickerImage,
  maxSize: number,
): Promise<PickerImage> {
  if (img.size < maxSize) {
    return img
  }
  return await doResize(img.path, {
    width: img.width,
    height: img.height,
    maxSize,
  })
}

export interface DownloadAndResizeOpts {
  uri: string
  width: number
  height: number
  maxSize: number
  timeout: number
}

export async function downloadAndResize(opts: DownloadAndResizeOpts) {
  const controller = new AbortController()
  const to = setTimeout(() => controller.abort(), opts.timeout || 5e3)
  const res = await fetch(opts.uri)
  const resBody = await res.blob()
  clearTimeout(to)

  const dataUri = await blobToDataUri(resBody)
  return await doResize(dataUri, opts)
}

export async function shareImageModal(_opts: {uri: string}) {
  // TODO
  throw new Error('TODO')
}

export async function saveImageToMediaLibrary(_opts: {uri: string}) {
  // TODO
  throw new Error('TODO')
}

export async function downloadVideoWeb({uri}: {uri: string}) {
  // download the file to cache
  const downloadResponse = await fetch(uri)
    .then(res => res.blob())
    .catch(() => null)
  if (downloadResponse == null) return false
  const extension = mimeToExt(downloadResponse.type)

  const blobUrl = URL.createObjectURL(downloadResponse)
  const link = document.createElement('a')
  link.setAttribute('download', uri.slice(-10) + '.' + extension)
  link.setAttribute('href', blobUrl)
  link.click()
  return true
}

export async function getImageDim(path: string): Promise<Dimensions> {
  var img = document.createElement('img')
  const promise = new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
  })
  img.src = path
  await promise
  return {width: img.width, height: img.height}
}

// internal methods
// =

interface DoResizeOpts {
  width: number
  height: number
  maxSize: number
}

async function doResize(
  dataUri: string,
  opts: DoResizeOpts,
): Promise<PickerImage> {
  const originalSize = getDataUriSize(dataUri)

  let newDataUri

  let maxQualityPercentage = 110 //exclusive
  let finalCompressionPercentage: number = 100

  const imageData = await createResizedImage(dataUri, {
    width: opts.width,
    height: opts.height,
  })

  while (maxQualityPercentage > 1) {
    const qualityPercentage = Math.round(maxQualityPercentage - 10)

    const [tempDataUri, size] = await createCompressedImage(
      imageData,
      qualityPercentage,
    )

    console.log(size, qualityPercentage, originalSize)
    if (size <= opts.maxSize && size <= originalSize) {
      newDataUri = tempDataUri
      finalCompressionPercentage = qualityPercentage
      break
    } else {
      maxQualityPercentage = qualityPercentage
    }
  }

  if (!newDataUri) {
    throw new Error('Failed to compress image')
  }
  return {
    path: newDataUri,
    mime: 'image/webp',
    size: getDataUriSize(newDataUri),
    width: opts.width,
    height: opts.height,
    quality: finalCompressionPercentage,
  }
}

function createResizedImage(
  dataUri: string,
  {
    width,
    height,
  }: {
    width: number
    height: number
  },
): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.addEventListener('load', async () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return reject(new Error('Failed to resize image'))
      }
      let scale = 1
      if (img.width > width || img.height > height) {
        scale = img.width < img.height ? width / img.width : height / img.height
      }
      let w = img.width * scale
      let h = img.height * scale

      canvas.width = w
      canvas.height = h

      ctx.drawImage(img, 0, 0, w, h)

      const imageData = ctx.getImageData(0, 0, img.width, img.height)

      resolve(imageData)
    })
    img.addEventListener('error', ev => {
      reject(ev.error)
    })
    img.src = dataUri
  })
}

async function createCompressedImage(
  imageData: ImageData,
  quality: number,
): Promise<[string, number]> {
  const webpBuffer = await encode(imageData, {
    lossless: quality === 100 ? 1 : 0,
    quality: quality || 100,
    method: 4,
  })

  const size = webpBuffer.byteLength

  const blob = new Blob([webpBuffer], {type: 'image/webp'})
  return [URL.createObjectURL(blob), size]
}

export async function saveBytesToDisk(
  filename: string,
  bytes: Uint8Array<ArrayBuffer>,
  type: string,
) {
  const blob = new Blob([bytes], {type})
  const url = URL.createObjectURL(blob)
  await downloadUrl(url, filename)
  // Firefox requires a small delay
  setTimeout(() => URL.revokeObjectURL(url), 100)
  return true
}

async function downloadUrl(href: string, filename: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
}

export async function safeDeleteAsync() {
  // no-op
}
