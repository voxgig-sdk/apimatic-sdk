# API definition provenance

## apimatic-transformer-openapi.json

- **Publisher:** APIMatic (API Transformer)
- **Format:** OpenAPI 3.0.3
- **Size:** 1767 bytes
- **Coverage:** 1 path, `POST /transform`, 1 operation, 2 schemas — the whole
  API Transformer surface.

**One path is full coverage here, not a subset.** API Transformer is a
single-operation service: one POST that converts an API description between
formats. Corroborated against an independent catalogue of the same API, which
also lists exactly `/transform`
(https://github.com/jentic/jentic-public-apis/tree/main/apis/openapi/apimatic.io/main/1.0/openapi.json).

## Renamed from `apimatic-transform-only.json`

The `-only` suffix read as a hand-reduced subset, which is what that naming
means elsewhere in this fleet, and `data/cedar.csv` named the file this one now
carries. Renamed on 2026-09-26; the content is unchanged.
