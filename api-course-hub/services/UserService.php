<?php

require_once 'TokenService.php';

class UserService {

    function getAll() {
        if (tokenData()->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
      
        try {
            $stmt = Flight::db()->prepare("SELECT * FROM user");
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            Flight::db()->close();

            Flight::json($result, 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function getOne($id) {
        if (tokenData()->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        try {
            $stmt = Flight::db()->prepare("SELECT * FROM user WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

            Flight::json($result, 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function create() {
        if (tokenData()->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
      
        try {
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
        
            $stmt = Flight::db()->prepare("INSERT INTO user (name, father_last_name, mother_last_name, password, birthday, phone_number, email, user_type, is_active)
            VALUES (?,?,?,?,?,?,?,?,?);");
            $stmt->bind_param('ssssssssi', $name, $father_last_name, $mother_last_name, $enc_password, $birthday, $phone_number, $email, $user_type, $is_active);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        
            Flight::json(array('status' => 'success', 'message' => 'User stored correctly'), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function update($id) {
        if (tokenData()->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        try {
            $data = Flight::request()->data;
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;
            $user_type = $data->user_type;
            $is_active = $data->is_active;
        
            $stmt = Flight::db()->prepare("UPDATE user SET name = ?, father_last_name = ?, mother_last_name = ?, birthday = ?, phone_number = ?, email = ?, user_type = ?, is_active = ?
            WHERE id = ?");
            $stmt->bind_param('sssssssii', $name, $father_last_name, $mother_last_name, $birthday, $phone_number, $email, $user_type, $is_active, $id);
            $stmt->execute();
            $rows = $stmt->affected_rows;
            $stmt->close();
            Flight::db()->close();

            if ($rows == 0)
                Flight::halt(200, json_encode(['status' => 'warning', 'message' => "No changes were made to the user with id {$id}"]));
        
            Flight::json(array('success' => 'User changed correctly', 'affected rows' => $rows), 200);
            
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function delete($id) {
        if (tokenData()->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        try {
            $stmt = Flight::db()->prepare("DELETE FROM user WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $rows = $stmt->affected_rows;
            $stmt->close();
            Flight::db()->close();

            if ($rows == 0)
                Flight::halt(200, json_encode(['status' => 'warning', 'message' => "The user with id: {$id} dont exist"]));
        
            Flight::json(array('success' => 'User deleted correctly', 'affected rows' => $rows), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function auth() {
        try {
            $data = Flight::request()->data;
            $email = $data->email;
            $password = $data->password;
        
            $stmt = Flight::db()->prepare("SELECT password, id, user_type FROM user WHERE email = ? AND is_active = 1;");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();
        
            if (is_null($result) || !password_verify($password, $result['password'])) 
                Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password or user']));
            
            $token = encodeToken($result['id'], $result['user_type']);
        
            Flight::json(array('token' => $token), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }
}