# Apimatic SDK feature factory

from apimatic_sdk.feature.base_feature import ApimaticBaseFeature
from apimatic_sdk.feature.debug_feature import ApimaticDebugFeature
from apimatic_sdk.feature.idempotency_feature import ApimaticIdempotencyFeature
from apimatic_sdk.feature.metrics_feature import ApimaticMetricsFeature
from apimatic_sdk.feature.paging_feature import ApimaticPagingFeature
from apimatic_sdk.feature.ratelimit_feature import ApimaticRatelimitFeature
from apimatic_sdk.feature.retry_feature import ApimaticRetryFeature
from apimatic_sdk.feature.test_feature import ApimaticTestFeature
from apimatic_sdk.feature.timeout_feature import ApimaticTimeoutFeature


_FEATURES = {
    "base": lambda: ApimaticBaseFeature(),
    "debug": lambda: ApimaticDebugFeature(),
    "idempotency": lambda: ApimaticIdempotencyFeature(),
    "metrics": lambda: ApimaticMetricsFeature(),
    "paging": lambda: ApimaticPagingFeature(),
    "ratelimit": lambda: ApimaticRatelimitFeature(),
    "retry": lambda: ApimaticRetryFeature(),
    "test": lambda: ApimaticTestFeature(),
    "timeout": lambda: ApimaticTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
