package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/apimatic-sdk/go"
	"github.com/voxgig-sdk/apimatic-sdk/go/core"

	vs "github.com/voxgig-sdk/apimatic-sdk/go/utility/struct"
)

func TestTransformEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Transform(nil)
		if ent == nil {
			t.Fatal("expected non-nil TransformEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := transformBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "transform." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set APIMATIC_TEST_TRANSFORM_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		transformRef01Ent := client.Transform(nil)
		transformRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "transform"}, setup.data), "transform_ref01"))

		transformRef01DataResult, err := transformRef01Ent.Create(transformRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		transformRef01Data = core.ToMapAny(entityData(transformRef01DataResult))
		if transformRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if transformRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

	})
}

func transformBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "transform", "TransformTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read transform test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse transform test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"transform01", "transform02", "transform03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("APIMATIC_TEST_TRANSFORM_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"APIMATIC_TEST_TRANSFORM_ENTID": idmap,
		"APIMATIC_TEST_LIVE":      "FALSE",
		"APIMATIC_TEST_EXPLAIN":   "FALSE",
		"APIMATIC_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["APIMATIC_TEST_TRANSFORM_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["APIMATIC_TEST_LIVE"] == "TRUE" {
		mergedOpts := vs.Merge([]any{
			map[string]any{
				"apikey": env["APIMATIC_APIKEY"],
			},
			extra,
		})
		client = sdk.NewApimaticSDK(core.ToMapAny(mergedOpts))
	}

	live := env["APIMATIC_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["APIMATIC_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
