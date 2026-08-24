<?php
declare(strict_types=1);

// Apimatic SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class ApimaticMakeContext
{
    public static function call(array $ctxmap, ?ApimaticContext $basectx): ApimaticContext
    {
        return new ApimaticContext($ctxmap, $basectx);
    }
}
