<?php
declare(strict_types=1);

// Apimatic SDK utility: result_body

class ApimaticResultBody
{
    public static function call(ApimaticContext $ctx): ?ApimaticResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
