const server = require('../../../../app/server')

jest.mock('../../../../app/api', () => {
  return {
    post: jest.fn(async (url, data) => {
      if (data?._request?.SupplierAccount === '123') {
        return {
          data: {
            $id: '1',
            Result: true,
            SupplierBankAccounts: [
              {
                $id: '2',
                AccNo: '1234',
                CurrCode: 'GBP'
              }
            ],
            InfoMessages: [
              'Supplier number is valid!'
            ]
          }
        }
      } else if (data?._request?.SupplierAccount === '9999') {
        return {
          data: {
            $id: '1',
            Result: false,
            SupplierBankAccounts: [],
            InfoMessages: [
              'Supplier number is not valid!'
            ]
          }
        }
      } else {
        throw new Error()
      }
    })
  }
})

describe('GET /getActiveSupplierBankAccounts/{frn}', () => {
  beforeAll(async () => {
    process.env.API_KEY = 'test' // pragma: allowlist secret
    await server.start()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('should return active supplier bank accounts for a valid FRN', async () => {
    const options = {
      method: 'GET',
      url: '/getActiveSupplierBankAccounts/123',
      headers: {
        'X-API-Key': 'test'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual({
      result: true,
      supplierBankAccounts: [
        {
          accNo: '1234',
          currCode: 'GBP'
        }
      ],
      infoMessages: [
        'Supplier number is valid!'
      ]
    })
  })

  test('should return no supplier accounts for invalid FRN', async () => {
    const options = {
      method: 'GET',
      url: '/getActiveSupplierBankAccounts/9999',
      headers: {
        'X-API-Key': 'test'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.result).toEqual({
      result: false,
      supplierBankAccounts: [],
      infoMessages: [
        'Supplier number is not valid!'
      ]
    })
  })

  test('should return Boom.internal() on error', async () => {
    const options = {
      method: 'GET',
      url: '/getActiveSupplierBankAccounts/000000000000000000000000000',
      headers: {
        'X-API-Key': 'test'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })
})
