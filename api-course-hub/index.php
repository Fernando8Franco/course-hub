<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::register('db', mysqli::class, ['course-hub-mysql-1', 'root', 'Fernand0101', 'CourseHubDB']);

function getToken() {
  $key = '&VAv,Bw3BJ7nx+Q8m-yc2_E8WFLigl7RPo)0$l-us6j2[un=w~';
  $headers = apache_request_headers();

  if (!isset($headers['Authorization']))
    Flight::halt(406, json_encode(['error' => 'Not acceptable', 'estatus' => 'error']));

  $auth = explode(' ', $headers['Authorization']);
  $token = $auth[1];

  try {
    $decode_token = JWT::decode($token, new Key($key, 'HS256'));
  } catch (Exception $e) {
    Flight::halt(403, json_encode(['error' => $e->getMessage(), 'estatus' => 'error']));
  }

  return $decode_token;
}

function validateToken() {
  $info = getToken();
  $conn = Flight::db();
  $stmt = $conn->prepare("SELECT * FROM user WHERE id = ? AND user_type = 'ADMIN'");
  $stmt->bind_param('i', $info->data);
  $stmt->execute();
  $result = $stmt->get_result()->fetch_assoc();

  if (is_null($result))
    return false;
  else
    return $result;
}

Flight::route('GET /users', function () {
  if (!validateToken())
    Flight::halt(403, json_encode(['error' => 'Unathorized', 'estatus' => 'error']));

  try {
    $conn = Flight::db();
    $stmt = $conn->prepare("SELECT * FROM users_view");
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    Flight::json($result, 200);
  } catch (Exception $e) {
    Flight::json(array('error' => $e->getMessage()), 400);
  }
});

Flight::route('GET /user/@id', function ($id) {
  if (!validateToken())
    Flight::halt(403, json_encode(['error' => 'Unathorized', 'estatus' => 'error']));
  
  try {
    $conn = Flight::db();
    $stmt = $conn->prepare("SELECT * FROM user WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    Flight::json($result);
  } catch (Exception $e) {
    Flight::json(array('error' => $e->getMessage()), 400);
  }
});

Flight::route('POST /auth-admin', function () {
  try {
    $conn = Flight::db();

    $data = Flight::request()->data;
    $email = $data->email;
    $password = $data->password;

    $stmt = $conn->prepare("SELECT password, id FROM user WHERE email = ? AND is_active = 1 AND user_type = 'ADMIN';");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();

    if (!is_null($result) && password_verify($password, $result['password'])) {
      $now = strtotime('now');
      $key = '&VAv,Bw3BJ7nx+Q8m-yc2_E8WFLigl7RPo)0$l-us6j2[un=w~';
      $payload = [
        'exp' => $now + 3600,
        'data' => $result['id']
      ];
  
      $jwt = JWT::encode($payload, $key, 'HS256');
  
      Flight::json(array('token' => $jwt), 200);
    } else {
      Flight::json(array('error' => 'Wrong password or user'), 400);
    }
  } catch (Exception $e) {
    Flight::json(array('error' => $e->getMessage()), 400);
  }
});

Flight::route('POST /users', function () {
  if (!validateToken())
    Flight::halt(403, json_encode(['error' => 'Unathorized', 'estatus' => 'error']));

  try {
    $conn = Flight::db();

    $data = Flight::request()->data;
    $name = $data->name;
    $father_last_name = $data->father_last_name;
    $mother_last_name = $data->mother_last_name;
    $password = $data->password;
    $birthday = $data->birthday;
    $phone_number = $data->phone_number;
    $email = $data->email;
    $user_type = $data->user_type;
    $is_active = $data->is_active;

    $enc_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO user (name, father_last_name, mother_last_name, password, birthday, phone_number, email, user_type, is_active)
    VALUES (?,?,?,?,?,?,?,?,?);");
    $stmt->bind_param('ssssssssi', $name, $father_last_name, $mother_last_name, $enc_password, $birthday, $phone_number, $email, $user_type, $is_active);
    $stmt->execute();

    Flight::json(array('success' => 'User stored correctly'), 200);
  } catch (Exception $e) {
    Flight::json(array('error' => $e->getMessage()), 400);
  }
});

Flight::route('PUT /user/@id', function ($id) {
  if (!validateToken())
    Flight::halt(403, json_encode(['error' => 'Unathorized', 'estatus' => 'error']));

  try {
    $conn = Flight::db();

    $data = Flight::request()->data;
    $name = $data->name;
    $father_last_name = $data->father_last_name;
    $mother_last_name = $data->mother_last_name;
    $password = $data->password;
    $birthday = $data->birthday;
    $phone_number = $data->phone_number;
    $email = $data->email;
    $user_type = $data->user_type;
    $is_active = $data->is_active;

    $enc_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("UPDATE user SET name = ?, father_last_name = ?, mother_last_name = ?, password = ?, birthday = ?, phone_number = ?, email = ?, user_type = ?, is_active = ?
    WHERE id = ?");
    $stmt->bind_param('ssssssssii', $name, $father_last_name, $mother_last_name, $enc_password, $birthday, $phone_number, $email, $user_type, $is_active, $id);
    $stmt->execute();
    $rows = $stmt->affected_rows;

    if ($rows == 0) {
      Flight::json(array('warning' => "No changes were made to the user with id {$id}"), 200);
    } else {
      Flight::json(array('success' => 'User changed correctly', 'affected rows' => $rows), 200);
    }

  } catch (Exception $e) {
    Flight::json(array('error' => $e->getMessage()), 400);
  }
});

Flight::route('DELETE /user/@id', function ($id) {
  if (!validateToken())
    Flight::halt(403, json_encode(['error' => 'Unathorized', 'estatus' => 'error']));

  try {
    $conn = Flight::db();

    $stmt = $conn->prepare("DELETE FROM user WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $rows = $stmt->affected_rows;

    if ($rows == 0) {
      Flight::json(array('warning' => "The user with id: {$id} dont exist"), 200);
    } else {
      Flight::json(array('success' => 'User deleted correctly', 'affected rows' => $rows), 200);
    }

  } catch (Exception $e) {
    Flight::json(array('error' => $e->getMessage()), 400);
  }
});

Flight::start();