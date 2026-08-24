package voxgigapimaticsdk

import (
	"github.com/voxgig-sdk/apimatic-sdk/go/core"
	"github.com/voxgig-sdk/apimatic-sdk/go/entity"
	"github.com/voxgig-sdk/apimatic-sdk/go/feature"
	_ "github.com/voxgig-sdk/apimatic-sdk/go/utility"
)

// Type aliases preserve external API.
type ApimaticSDK = core.ApimaticSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type ApimaticEntity = core.ApimaticEntity
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type ApimaticError = core.ApimaticError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewTransformEntityFunc = func(client *core.ApimaticSDK, entopts map[string]any) core.ApimaticEntity {
		return entity.NewTransformEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewApimaticSDK = core.NewApimaticSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var SharedConfig = core.SharedConfig

// No-arg convenience constructors. Go has no default-argument syntax,
// so these aliases let callers write `sdk.New()` / `sdk.Test()`
// instead of `sdk.NewApimaticSDK(nil)` / `sdk.TestSDK(nil, nil)`
// for the common no-options case.
func New() *ApimaticSDK  { return NewApimaticSDK(nil) }
func Test() *ApimaticSDK { return TestSDK(nil, nil) }
var NewBaseFeature = feature.NewBaseFeature
var NewTestFeature = feature.NewTestFeature
