<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'vendor/autoload.php';

Flight::register('db', mysqli::class, ['course-hub-mysql-1', 'root', 'Fernand0101', 'CourseHubDB']);

Flight::route('GET /users', function () {
  try {
    $conn = Flight::db();
    $stmt = $conn->prepare("SELECT * FROM user");
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    Flight::json($result);
  } catch (Exception $e) {
    Flight::json(array('error' => $e->getMessage()), 400);
  }
});

Flight::route('GET /user/@id', function ($id) {
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

Flight::route('POST /users', function () {
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

    $stmt = $conn->prepare("INSERT INTO user (name, father_last_name, mother_last_name, password, birthday, phone_number, email, user_type, is_active)
    VALUES (?,?,?,?,?,?,?,?,?);");
    $stmt->bind_param('ssssssssi', $name, $father_last_name, $mother_last_name, $password, $birthday, $phone_number, $email, $user_type, $is_active);
    $stmt->execute();

    Flight::json(array('success' => 'User stored correctly'), 200);
  } catch (Exception $e) {
    Flight::json(array('error' => $e->getMessage()), 400);
  }
});

Flight::start();