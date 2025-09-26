import {beforeAll, describe, expect, jest, test} from '@jest/globals'
import {nanoid} from 'nanoid/non-secure'

import {Logger} from '#/logger'
import {LogLevel} from '#/logger/types'

beforeAll(() => {
  jest.useFakeTimers()
})

describe('general functionality', () => {
  test('default params', () => {
    const logger = new Logger()
    expect(logger.level).toEqual(LogLevel.Info)
  })

  test('can override default params', () => {
    const logger = new Logger({
      level: LogLevel.Debug,
    })
    expect(logger.level).toEqual(LogLevel.Debug)
  })

  test('contextFilter overrides level', () => {
    const logger = new Logger({
      level: LogLevel.Info,
      contextFilter: 'test',
    })
    expect(logger.level).toEqual(LogLevel.Debug)
  })

  test('supports extra metadata', () => {
    const timestamp = Date.now()
    const logger = new Logger({})

    const mockTransport = jest.fn()

    logger.addTransport(mockTransport)

    const extra = {foo: true}
    logger.warn('message', extra)

    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Warn,
      undefined,
      'message',
      extra,
      timestamp,
    )
  })

  test('supports nullish/falsy metadata', () => {
    const timestamp = Date.now()
    const logger = new Logger({})

    const mockTransport = jest.fn()

    const remove = logger.addTransport(mockTransport)

    // @ts-expect-error testing the JS case
    logger.warn('a', null)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Warn,
      undefined,
      'a',
      {},
      timestamp,
    )

    // @ts-expect-error testing the JS case
    logger.warn('b', false)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Warn,
      undefined,
      'b',
      {},
      timestamp,
    )

    // @ts-expect-error testing the JS case
    logger.warn('c', 0)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Warn,
      undefined,
      'c',
      {},
      timestamp,
    )

    remove()

    logger.addTransport((level, context, message, metadata) => {
      expect(typeof metadata).toEqual('object')
    })

    // @ts-expect-error testing the JS case
    logger.warn('message', null)
  })

  test('add/remove transport', () => {
    const timestamp = Date.now()
    const logger = new Logger({})
    const mockTransport = jest.fn()

    const remove = logger.addTransport(mockTransport)

    logger.warn('warn')

    remove()

    logger.warn('warn')

    // only called once bc it was removed
    expect(mockTransport).toHaveBeenNthCalledWith(
      1,
      LogLevel.Warn,
      undefined,
      'warn',
      {},
      timestamp,
    )
  })
})

describe('create', () => {
  test('create', () => {
    const mockTransport = jest.fn()
    const timestamp = Date.now()
    const message = nanoid()
    const logger = Logger.create(Logger.Context.Default)

    logger.addTransport(mockTransport)
    logger.info(message, {})

    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Info,
      Logger.Context.Default,
      message,
      {},
      timestamp,
    )
  })
})

describe('debug contexts', () => {
  test('specific', () => {
    const mockTransport = jest.fn()
    const timestamp = Date.now()
    const message = nanoid()
    const logger = new Logger({
      // @ts-ignore
      context: 'specific',
      level: LogLevel.Debug,
    })

    logger.addTransport(mockTransport)
    logger.debug(message, {})

    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Debug,
      'specific',
      message,
      {},
      timestamp,
    )
  })

  test('namespaced', () => {
    const mockTransport = jest.fn()
    const timestamp = Date.now()
    const message = nanoid()
    const logger = new Logger({
      // @ts-ignore
      context: 'namespace:foo',
      contextFilter: 'namespace:*',
      level: LogLevel.Debug,
    })

    logger.addTransport(mockTransport)
    logger.debug(message, {})

    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Debug,
      'namespace:foo',
      message,
      {},
      timestamp,
    )
  })

  test('ignores inactive', () => {
    const mockTransport = jest.fn()
    const timestamp = Date.now()
    const message = nanoid()
    const logger = new Logger({
      // @ts-ignore
      context: 'namespace:bar:baz',
      contextFilter: 'namespace:foo:*',
    })

    logger.addTransport(mockTransport)
    logger.debug(message, {})

    expect(mockTransport).not.toHaveBeenCalledWith(
      LogLevel.Debug,
      'namespace:bar:baz',
      message,
      {},
      timestamp,
    )
  })
})

describe('supports levels', () => {
  test('debug', () => {
    const timestamp = Date.now()
    const logger = new Logger({
      level: LogLevel.Debug,
    })
    const message = nanoid()
    const mockTransport = jest.fn()

    logger.addTransport(mockTransport)

    logger.debug(message)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Debug,
      undefined,
      message,
      {},
      timestamp,
    )

    logger.info(message)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Info,
      undefined,
      message,
      {},
      timestamp,
    )

    logger.warn(message)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Warn,
      undefined,
      message,
      {},
      timestamp,
    )

    const e = new Error(message)
    logger.error(e)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Error,
      undefined,
      e,
      {},
      timestamp,
    )
  })

  test('info', () => {
    const timestamp = Date.now()
    const logger = new Logger({
      level: LogLevel.Info,
    })
    const message = nanoid()
    const mockTransport = jest.fn()

    logger.addTransport(mockTransport)

    logger.debug(message)
    expect(mockTransport).not.toHaveBeenCalled()

    logger.info(message)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Info,
      undefined,
      message,
      {},
      timestamp,
    )
  })

  test('warn', () => {
    const timestamp = Date.now()
    const logger = new Logger({
      level: LogLevel.Warn,
    })
    const message = nanoid()
    const mockTransport = jest.fn()

    logger.addTransport(mockTransport)

    logger.debug(message)
    expect(mockTransport).not.toHaveBeenCalled()

    logger.info(message)
    expect(mockTransport).not.toHaveBeenCalled()

    logger.warn(message)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Warn,
      undefined,
      message,
      {},
      timestamp,
    )
  })

  test('error', () => {
    const timestamp = Date.now()
    const logger = new Logger({
      level: LogLevel.Error,
    })
    const message = nanoid()
    const mockTransport = jest.fn()

    logger.addTransport(mockTransport)

    logger.debug(message)
    expect(mockTransport).not.toHaveBeenCalled()

    logger.info(message)
    expect(mockTransport).not.toHaveBeenCalled()

    logger.warn(message)
    expect(mockTransport).not.toHaveBeenCalled()

    const e = new Error('original message')
    logger.error(e)
    expect(mockTransport).toHaveBeenCalledWith(
      LogLevel.Error,
      undefined,
      e,
      {},
      timestamp,
    )
  })
})
