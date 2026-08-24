package core

type ApimaticError struct {
	IsApimaticError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewApimaticError(code string, msg string, ctx *Context) *ApimaticError {
	return &ApimaticError{
		IsApimaticError: true,
		Sdk:              "Apimatic",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *ApimaticError) Error() string {
	return e.Msg
}
