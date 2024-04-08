<?php

namespace Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use flight;
use Exception;

function encodeToken($user_id, $user_type) {
    $payload = [
    'exp' => time() + 3600,
    'user_id' => $user_id,
    'user_type' => $user_type
    ];

    return JWT::encode($payload, $_ENV['KEY'], 'HS256');
}

function getToken() {
    $headers = apache_request_headers();

    if (!isset($headers['Authorization']))
        Flight::halt(406, json_encode(['status' => 'error', 'message' => 'Header Authorization not found']));

    try {
        $token = explode(' ', $headers['Authorization'])[1];
    } catch (Exception $e) {
        Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong header']));
    }

    return $token;
}

function validateToken($t) {
    $token = $t;

    try {
        $decode_token_data = JWT::decode($token, new Key($_ENV['KEY'], 'HS256'));
    } catch (Exception $e) {
        Flight::halt(403, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
    }

    try {
        $stmt = Flight::db()->prepare("SELECT EXISTS (SELECT * FROM user WHERE id = ? AND user_type = ?) as valid_user");
        $stmt->bind_param('is', $decode_token_data->user_id, $decode_token_data->user_type);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
    } catch (Exception $e) {
        Flight::json(array(['status' => 'error', 'message' => $e->getMessage()]), 400);
    }
    
    return $result['valid_user'] ? $decode_token_data : false;
}

function tokenData() {
    if (!validateToken(getToken()))
        Flight::halt(401, json_encode(['status' => 'error', 'message' => 'Unauthorized - The token data is not valid']));

    return validateToken(getToken());
}