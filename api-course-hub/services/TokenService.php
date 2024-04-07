<?php

namespace Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

function encodeToken($user_id, $user_type) {
    $key = '&VAv,Bw3BJ7nx+Q8m-yc2_E8WFLigl7RPo)0$l-us6j2[un=w~';
    
    $payload = [
    'exp' => time() + 3600,
    'user_id' => $user_id,
    'user_type' => $user_type
    ];

    return JWT::encode($payload, $key, 'HS256');
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
  $key = '&VAv,Bw3BJ7nx+Q8m-yc2_E8WFLigl7RPo)0$l-us6j2[un=w~';
  $token = $t;

  try {
    $decode_token_data = JWT::decode($token, new Key($key, 'HS256'));
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

function tokenData($token = null) {
  if (!is_null($token)) {
    if (!validateToken($token))
      Flight::halt(401, json_encode(['status' => 'error', 'message' => 'Unauthorized - The token data is not valid'])); 

    return validateToken($token);
  }

  if (!validateToken(getToken()))
    Flight::halt(401, json_encode(['status' => 'error', 'message' => 'Unauthorized - The token data is not valid']));

  return validateToken(getToken());
}