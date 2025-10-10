import {createDownloadResumable, deleteAsync} from 'expo-file-system/legacy'

jest.mock('#/lib/media/util', () => ({
  getDataUriSize: () => 300000, // Smaller than maxSize
}))
import {manipulateAsync, SaveFormat} from 'expo-image-manipulator'

import {
  downloadAndResize,
  type DownloadAndResizeOpts,
  getResizedDimensions,
} from '../../src/lib/media/manip'

const mockResizedImage = {
  path: 'file://resized-image.jpg',
  size: 100,
  width: 100,
  height: 100,
  mime: 'image/jpeg',
  quality: 100,
}

describe('downloadAndResize', () => {
  const errorSpy = jest.spyOn(global.console, 'error')

  beforeEach(() => {
    const mockedCreateResizedImage = manipulateAsync as jest.Mock
    mockedCreateResizedImage.mockResolvedValue({
      uri: 'file://resized-image.jpg',
      ...mockResizedImage,
    });
    
    jest.mock('expo-file-system/legacy', () => ({
      getInfoAsync: jest.fn().mockResolvedValue({
        exists: true,
        size: 100, // Small enough to pass the maxSize check
      }),
      createDownloadResumable: jest.fn(),
      deleteAsync: jest.fn(),
    }));
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return resized image for valid URI and options', async () => {
    const mockedFetch = createDownloadResumable as jest.Mock
    mockedFetch.mockReturnValue({
      cancelAsync: jest.fn(),
      downloadAsync: jest
        .fn()
        .mockResolvedValue({uri: 'file://resized-image.jpg'}),
    })

    const opts: DownloadAndResizeOpts = {
      uri: 'https://example.com/image.jpg',
      width: 100,
      height: 100,
      maxSize: 500000,
      timeout: 10000,
      webp: false,
    }

    const result = await downloadAndResize(opts)
    expect(result).toEqual(mockResizedImage)
    expect(createDownloadResumable).toHaveBeenCalledWith(
      opts.uri,
      expect.anything(),
      {
        cache: true,
      },
    )

    // First time it gets called is to get dimensions
    expect(manipulateAsync).toHaveBeenCalledWith(expect.any(String), [], {})
    expect(manipulateAsync).toHaveBeenCalledWith(
      expect.any(String),
      [{resize: {height: opts.height, width: opts.width}}],
      {format: SaveFormat.JPEG, compress: 1.0},
    )
    expect(deleteAsync).toHaveBeenCalledWith(expect.any(String), {
      idempotent: true,
    })
  })

  it('should return undefined for invalid URI', async () => {
    const opts: DownloadAndResizeOpts = {
      uri: 'invalid-uri',
      width: 100,
      height: 100,
      maxSize: 500000,
      timeout: 10000,
      webp: false,
    }

    const result = await downloadAndResize(opts)
    expect(errorSpy).toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('should not downsize whenever dimensions are below the max dimensions', () => {
    const initialDimensionsOne = {
      width: 1200,
      height: 1000,
    }
    const resizedDimensionsOne = getResizedDimensions(initialDimensionsOne)

    const initialDimensionsTwo = {
      width: 1000,
      height: 1200,
    }
    const resizedDimensionsTwo = getResizedDimensions(initialDimensionsTwo)

    expect(resizedDimensionsOne).toEqual(initialDimensionsOne)
    expect(resizedDimensionsTwo).toEqual(initialDimensionsTwo)
  })

  it('should maintain original dimensions if they are below the max dimensions', () => {
    const initialDimensionsOne = {
      width: 3000,
      height: 1500,
    }
    const resizedDimensionsOne = getResizedDimensions(initialDimensionsOne)

    const initialDimensionsTwo = {
      width: 2000,
      height: 4000,
    }
    const resizedDimensionsTwo = getResizedDimensions(initialDimensionsTwo)

    expect(resizedDimensionsOne).toEqual(initialDimensionsOne)
    expect(resizedDimensionsTwo).toEqual(initialDimensionsTwo)
  })
})
