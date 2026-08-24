
const envlocal = __dirname + '/../../../.env.local'
require('dotenv').config({ quiet: true, path: [envlocal] })

const Path = require('node:path')
const Fs = require('node:fs')

const { test, describe } = require('node:test')
const assert = require('node:assert')


const { ApimaticSDK, BaseFeature, stdutil, config } = require('../../..')

const {
  envOverride,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
} = require('../../utility')


describe('TransformEntity', async () => {

  test('instance', async () => {
    const testsdk = ApimaticSDK.test()
    const ent = testsdk.Transform()
    assert(null != ent)
  })


  test('basic', async () => {

    const setup = basicSetup()
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const transform_ref01_ent = client.Transform()
    let transform_ref01_data = setup.data.new.transform['transform_ref01']

    transform_ref01_data = (await transform_ref01_ent.create(transform_ref01_data)).data()
    assert(null != transform_ref01_data.id)


  })
})



function basicSetup(extra) {
  // TODO: fix test def options
  const options = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname,
      '../../../../.sdk/test/entity/transform/TransformTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = ApimaticSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['transform01','transform02','transform03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'APIMATIC_TEST_TRANSFORM_ENTID': idmap,
    'APIMATIC_TEST_LIVE': 'FALSE',
    'APIMATIC_TEST_EXPLAIN': 'FALSE',
    'APIMATIC_APIKEY': 'NONE',
  })

  idmap = env['APIMATIC_TEST_TRANSFORM_ENTID']

  if ('TRUE' === env.APIMATIC_TEST_LIVE) {
    client = new ApimaticSDK(merge([
      {
        apikey: env.APIMATIC_APIKEY,
      },
      extra
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.APIMATIC_TEST_EXPLAIN,
    now: Date.now(),
  }

  return setup
}
  
