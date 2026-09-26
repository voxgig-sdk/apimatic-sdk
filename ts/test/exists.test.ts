
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { ApimaticSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = ApimaticSDK.test()
    equal(testsdk instanceof ApimaticSDK, true,
      'ApimaticSDK.test() must return a client synchronously')
  })

})
