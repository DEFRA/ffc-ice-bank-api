const server = require('../../app/server')
const init = require('../../app/index')

jest.mock('../../app/server')

describe('Init Script', () => {
  test('should start the server', async () => {
    const startSpy = jest.spyOn(server, 'start')
    await init()

    expect(startSpy).toHaveBeenCalled()
  })

  test('should log the error and exit the process with code 1', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})

    const unhandledRejectionHandler = process.listeners('unhandledRejection')[0]
    unhandledRejectionHandler('Test Error')

    expect(logSpy).toHaveBeenCalledWith('Test Error')
    expect(exitSpy).toHaveBeenCalledWith(1)

    logSpy.mockRestore()
    exitSpy.mockRestore()
  })
})
