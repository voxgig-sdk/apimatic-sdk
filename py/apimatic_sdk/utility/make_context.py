# Apimatic SDK utility: make_context

from apimatic_sdk.core.context import ApimaticContext


def make_context_util(ctxmap, basectx):
    return ApimaticContext(ctxmap, basectx)
