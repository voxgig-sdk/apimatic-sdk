<?php
declare(strict_types=1);

// Apimatic SDK exists test

require_once __DIR__ . '/../apimatic_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = ApimaticSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
