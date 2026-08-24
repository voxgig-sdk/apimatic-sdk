<?php
declare(strict_types=1);

// Apimatic SDK utility: result_headers

class ApimaticResultHeaders
{
    public static function call(ApimaticContext $ctx): ?ApimaticResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
