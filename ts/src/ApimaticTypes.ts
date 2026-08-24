// Typed models for the Apimatic SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Transform {
  downloadUrl?: string
  fileName?: string
  format?: string
  id?: string
  status?: string
  url: string
}

export interface TransformCreateData {
  downloadUrl?: string
  fileName?: string
  format?: string
  id?: string
  status?: string
  url: string
}

