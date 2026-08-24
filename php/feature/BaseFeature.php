<?php
declare(strict_types=1);

// Apimatic SDK base feature

class ApimaticBaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    // Positions this feature when added via the client `extend` option:
    // "__before__" / "__after__" / "__replace__" name an already-added
    // feature (mirrors the ts feature `_options`). Declared so setting it
    // on an extension instance avoids the dynamic-property deprecation.
    public ?array $_options = null;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(ApimaticContext $ctx, array $options): void {}
    public function PostConstruct(ApimaticContext $ctx): void {}
    public function PostConstructEntity(ApimaticContext $ctx): void {}
    public function SetData(ApimaticContext $ctx): void {}
    public function GetData(ApimaticContext $ctx): void {}
    public function GetMatch(ApimaticContext $ctx): void {}
    public function SetMatch(ApimaticContext $ctx): void {}
    public function PrePoint(ApimaticContext $ctx): void {}
    public function PreSpec(ApimaticContext $ctx): void {}
    public function PreRequest(ApimaticContext $ctx): void {}
    public function PreResponse(ApimaticContext $ctx): void {}
    public function PreResult(ApimaticContext $ctx): void {}
    public function PreDone(ApimaticContext $ctx): void {}
    public function PreUnexpected(ApimaticContext $ctx): void {}
}
