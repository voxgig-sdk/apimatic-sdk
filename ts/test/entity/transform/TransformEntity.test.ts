

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { ApimaticSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
loadEnvLocal(__dirname + '/../../../.env.local')


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

    const live = 'TRUE' === process.env.APIMATIC_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'transform.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"downloadUrl","req":false,"type":"`$STRING`","index$":0},{"active":true,"name":"fileName","req":false,"type":"`$STRING`","index$":1},{"active":true,"name":"format","op":{"create":{"req":true,"type":"`$STRING`"}},"req":false,"type":"`$STRING`","index$":2},{"active":true,"name":"id","req":false,"type":"`$STRING`","index$":3},{"active":true,"name":"status","req":false,"type":"`$STRING`","index$":4},{"active":true,"name":"url","req":true,"type":"`$STRING`","index$":5}],"id":{"field":"id","name":"id"},"name":"transform","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{},"contract":{"id":"POST /transform","json":"{\"operationId\":\"createTransformation\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"fileName\":{\"type\":\"string\"},\"format\":{\"type\":\"string\"},\"url\":{\"type\":\"string\"}},\"required\":[\"format\",\"url\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"downloadUrl\":{\"type\":\"string\"},\"format\":{\"type\":\"string\"},\"id\":{\"type\":\"string\"},\"status\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"The transformed API description\"}},\"security\":[{\"apiKeyAuth\":[]}],\"securitySchemes\":{\"apiKeyAuth\":{\"in\":\"header\",\"name\":\"authorization\",\"type\":\"apiKey\"}},\"securitySource\":\"definition\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/transform","segments":[{"lit":"transform"}],"select":{},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"transform","name__orig":"transform","Name":"Transform","name_":"transform","name-":"transform","NAME":"TRANSFORM","index$":0}, {"active":true,"entity":"transform","key$":"BasicTransformFlow","kind":"basic","name":"BasicTransformFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"transform_ref01"},"match":{},"op":"create","spec":[],"valid":[],"index$":0}]}, 'Transform')
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



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

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
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
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
  
