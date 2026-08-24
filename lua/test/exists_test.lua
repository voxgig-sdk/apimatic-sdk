-- Apimatic SDK exists test

local sdk = require("apimatic_sdk")

describe("ApimaticSDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
