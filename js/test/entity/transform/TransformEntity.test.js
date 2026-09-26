
const envlocal = __dirname + '/../../../.env.local'
require('../../utility').loadEnvLocal(envlocal)

const Path = require('node:path')
const Fs = require('node:fs')

const { test, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const { createLiveTransport } = require('../../live-runner')
const { runLiveEntity } = require('../../live-entity')


const { ApimaticSDK, BaseFeature, stdutil, config } = require('../../..')

const {
  envOverride,
  liveClientOptions,
  liveDelay,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
} = require('../../utility')


describe('TransformEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when APIMATIC_TEST_LIVE=TRUE.
  afterEach(liveDelay('APIMATIC_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = ApimaticSDK.test()
    const ent = testsdk.Transform()
    assert(null != ent)
  })


  test('basic', async (t) => {

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"downloadUrl":{"a":true,"h":"Download Url","n":"downloadUrl","r":false,"t":"`$STRING`","key$":"downloadUrl","index$":0},"fileName":{"a":true,"h":"File Name","n":"fileName","r":false,"t":"`$STRING`","key$":"fileName","index$":1},"format":{"a":true,"h":"Format","n":"format","op":{"create":{"req":true,"type":"`$STRING`"}},"r":false,"t":"`$STRING`","key$":"format","index$":2},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":3},"status":{"a":true,"h":"Status","n":"status","r":false,"t":"`$STRING`","key$":"status","index$":4},"url":{"a":true,"h":"Url","n":"url","r":true,"t":"`$STRING`","key$":"url","index$":5}},"id":{"field":"id","name":"id"},"name":"transform","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /transform","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/transform","q":{},"r":{},"s":[{"lit":"transform"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"transform","name__orig":"transform","Name":"Transform","name_":"transform","name-":"transform","NAME":"TRANSFORM","index$":0}, {"active":true,"entity":"transform","key$":"BasicTransformFlow","kind":"basic","name":"BasicTransformFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"transform_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'Transform', {"POST /transform":{"protocol":"http","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["format","url"],"properties":{"format":{"type":"string","key$":"format"},"url":{"type":"string","key$":"url"},"fileName":{"type":"string","key$":"fileName"}},"x-ref":"#/components/schemas/TransformationInput","index$":1}}}},"parameters":[]}})
    }
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
    'APIMATIC_APIKEY': '',
  })

  idmap = env['APIMATIC_TEST_TRANSFORM_ENTID']

  const live = 'TRUE' === env.APIMATIC_TEST_LIVE
  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['APIMATIC_TEST_TRANSFORM_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new ApimaticSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
        apikey: env.APIMATIC_APIKEY,
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when
      // the last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey and
      // server values above and handed the SDK undefined.
      extra || {},
      { system: { fetch: transport.fetch } }
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
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
