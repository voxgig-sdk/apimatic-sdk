-- Apimatic SDK error

local ApimaticError = {}
ApimaticError.__index = ApimaticError


function ApimaticError.new(code, msg, ctx)
  local self = setmetatable({}, ApimaticError)
  self.is_sdk_error = true
  self.sdk = "Apimatic"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function ApimaticError:error()
  return self.msg
end


function ApimaticError:__tostring()
  return self.msg
end


return ApimaticError
