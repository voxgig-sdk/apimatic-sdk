# Apimatic SDK exists test

import pytest
from apimatic_sdk import ApimaticSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = ApimaticSDK.test(None, None)
        assert testsdk is not None
