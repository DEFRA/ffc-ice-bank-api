const api = require('../api')
const Boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/getActiveSupplierBankAccounts/{frn}',
  options: {
    auth: 'apiKey'
  },
  handler: async (request, h) => {
    try {
      const payload = {
        _request: {
          SupplierAccount: request?.params?.frn
        }
      }

      const response = await api.post('/RSFVendBankAccountServiceGroup/RSFVendBankAccountService/getActiveSupplierBankAccounts', payload)
      if (!response?.data?.Result) {
        return { result: response?.data?.Result, supplierBankAccounts: response?.data?.SupplierBankAccounts, infoMessages: response?.data?.InfoMessages }
      }

      const supplierBankAccounts = response?.data?.SupplierBankAccounts.map(s => ({ accNo: s.AccNo, currCode: s.CurrCode }))

      return { result: response?.data?.Result, supplierBankAccounts, infoMessages: response?.data?.InfoMessages }
    } catch (error) {
      console.log({ error })
      return Boom.internal()
    }
  }
}
