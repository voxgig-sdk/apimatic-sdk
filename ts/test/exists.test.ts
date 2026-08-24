
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { ApimaticSDK } from '..'


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await ApimaticSDK.test()
    equal(null !== testsdk, true)
  })

})
