<?php
declare(strict_types=1);

// Apimatic SDK utility: prepare_body

class ApimaticPrepareBody
{
    public static function call(ApimaticContext $ctx): mixed
    {
        if ($ctx->op->input === 'data') {
            return ($ctx->utility->transform_request)($ctx);
        }
        return null;
    }
}
