
const { test, describe } = require('node:test')
const { equal } = require('node:assert')


const { ApimaticSDK } = require('..')


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await ApimaticSDK.test()
    equal(null !== testsdk, true)
  })

})
