<?php
declare(strict_types=1);

// Transform entity test

require_once __DIR__ . '/../apimatic_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class TransformEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = ApimaticSDK::test(null, null);
        $ent = $testsdk->Transform(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = transform_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "transform." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set APIMATIC_TEST_TRANSFORM_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $transform_ref01_ent = $client->Transform(null);
        $transform_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.transform"), "transform_ref01"));

        $transform_ref01_data_result = $transform_ref01_ent->create($transform_ref01_data, null);
        $transform_ref01_data = Helpers::to_map(is_object($transform_ref01_data_result) && method_exists($transform_ref01_data_result, 'data_get') ? $transform_ref01_data_result->data_get() : $transform_ref01_data_result);
        $this->assertNotNull($transform_ref01_data);
        $this->assertNotNull($transform_ref01_data["id"]);

    }
}

function transform_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/transform/TransformTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = ApimaticSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["transform01", "transform02", "transform03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("APIMATIC_TEST_TRANSFORM_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "APIMATIC_TEST_TRANSFORM_ENTID" => $idmap,
        "APIMATIC_TEST_LIVE" => "FALSE",
        "APIMATIC_TEST_EXPLAIN" => "FALSE",
        "APIMATIC_APIKEY" => "NONE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["APIMATIC_TEST_TRANSFORM_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["APIMATIC_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            [
                "apikey" => $env["APIMATIC_APIKEY"],
            ],
            $extra ?? [],
        ]);
        $client = new ApimaticSDK(Helpers::to_map($merged_opts));
    }

    $live = $env["APIMATIC_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["APIMATIC_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
