package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewTransformEntityFunc func(client *ApimaticSDK, entopts map[string]any) ApimaticEntity

