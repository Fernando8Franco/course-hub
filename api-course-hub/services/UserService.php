<?php

namespace Services;
require_once 'TokenService.php';
use flight;
use Exception;

class UserService {

    function getAll() {
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
      
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, mother_last_name, birthday, phone_number, email, user_type, is_active FROM user");
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
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, mother_last_name, birthday, phone_number, email, user_type, is_active FROM user WHERE id = ?");
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

    function getUserData() {
        $token_data = tokenData();

        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, mother_last_name, phone_number, email FROM user WHERE id = ? AND is_active = 1");
            $stmt->bind_param('i', $token_data->user_id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

            if (is_null($result))
                Flight::halt(400, json_encode(['status' => 'error', 'message' => 'The user is not active']));

            Flight::json($result, 200);
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

    function createAdmin() {
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
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
            $user_type = 'ADMIN';
            $is_active = $data->is_active;

            $stmt = Flight::db()->prepare("SELECT EXISTS (SELECT id FROM user WHERE email = ?) as email_exist");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if ($result['email_exist']) 
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
        
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

    function createCostumer() {
        try {
            $data = Flight::request()->data;
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $password = $data->password;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;
            $user_type = 'COSTUMER';
            $is_active = $data->is_active;

            $stmt = Flight::db()->prepare("SELECT EXISTS (SELECT id FROM user WHERE email = ?) as email_exist");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if ($result['email_exist']) 
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
        
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

    function sendResetPasswordEmail() {
        try {
            $data = Flight::request()->data;
            $email = $data->email;

            $stmt = Flight::db()->prepare("SELECT last_reset_request FROM user WHERE email = ?");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (!empty($result['last_reset_request'])) {
                $last_reset_time = strtotime($result['last_reset_request']);
                $current_time = time();
                $time_difference = $current_time - $last_reset_time;

                if ($time_difference < 600) {
                    $wait_time = 600 - $time_difference;
                    Flight::halt(400, json_encode(['status' => 'warning', 'message' => $wait_time]));
                }
            }

            $token = bin2hex(random_bytes(16));
            $token_hash = hash('sha256', $token);
            $expiry = date('Y-m-d H:i:s', time() + 10000);
            $reset_request = date('Y-m-d H:i:s', time());
        
            $stmt = Flight::db()->prepare("UPDATE user SET reset_token_hash = ?, reset_token_expires_at = ?, last_reset_request = ? WHERE email = ?");
            $stmt->bind_param('ssss', $token_hash, $expiry, $reset_request, $email);
            $stmt->execute();

            if ($stmt->affected_rows == 0)
                Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email send correctly']));

            try {
                $mail = require "MailerService.php";
    
                $mail->setFrom($_ENV['MAILER_ADDRESS'], 'No reply');
                $mail->addAddress($email);
                $mail->Subject = 'Reseteo de contraseña';
                $mail->CharSet = 'UTF-8';
                $mail->Body = <<<END
                Haga click <a href="{$_ENV['HOST']}/reset-password/{$token}">aquí</a> para cambiar su contraseña.
                END;

                try {
                    $mail->send();
                } catch (Exception $e) {
                    Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
                }
            } catch (Exception $e) {
                Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
            }
        
            Flight::json(array('status' => 'success', 'message' => 'Email send correctly'), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function resetPassword() {
        try {
            $data = Flight::request()->data;
            $token = $data->token;
            $password = $data->password;

            $token_hash = hash('sha256', $token);
            $enc_password = password_hash($password, PASSWORD_DEFAULT);
        
            $stmt = Flight::db()->prepare("SELECT id, reset_token_expires_at FROM user WHERE reset_token_hash = ?");
            $stmt->bind_param('s', $token_hash);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            
            if (is_null($result) || strtotime($result['reset_token_expires_at']) <= time())
                Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Token not valid']));
        
            $stmt = Flight::db()->prepare("UPDATE user SET password = ?, reset_token_hash = NULL, reset_token_expires_at = NULL WHERE id = ?");
            $stmt->bind_param('si', $enc_password, $result['id']);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();

            Flight::json(array('status' => 'success', 'message' => 'User password changed correctly'), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function update($id) {
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        try {
            $data = Flight::request()->data;
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;
            $is_active = $data->is_active;

            $stmt = Flight::db()->prepare("SELECT EXISTS (SELECT id FROM user WHERE email = ? AND id != ?) as email_exist");
            $stmt->bind_param('si', $email, $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if ($result['email_exist']) 
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
        
            $stmt = Flight::db()->prepare("UPDATE user SET name = ?, father_last_name = ?, mother_last_name = ?, birthday = ?, phone_number = ?, email = ?, is_active = ?
            WHERE id = ?");
            $stmt->bind_param('ssssssii', $name, $father_last_name, $mother_last_name, $birthday, $phone_number, $email, $is_active, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        
            Flight::json(array('status' => 'success', 'message' => 'User changed correctly'), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function updateCostumer() {
        $token_data = tokenData();

        if ($token_data->user_type != 'COSTUMER')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        try {
            $data = Flight::request()->data;
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;

            $stmt = Flight::db()->prepare("SELECT EXISTS (SELECT id FROM user WHERE email = ? AND id != ?) as email_exist");
            $stmt->bind_param('si', $email, $token_data->user_id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if ($result['email_exist']) 
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
        
            $stmt = Flight::db()->prepare("UPDATE user SET name = ?, father_last_name = ?, mother_last_name = ?, birthday = ?, phone_number = ?, email = ?
            WHERE id = ?");
            $stmt->bind_param('ssssssi', $name, $father_last_name, $mother_last_name, $birthday, $phone_number, $email, $token_data->user_id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        
            Flight::json(array('status' => 'success', 'message' => 'User changed correctly'), 200);
            
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function updatePassword() {
        $token_data = tokenData();

        try {
            $data = Flight::request()->data;
            $old_password = $data->old_password;
            $new_password = $data->new_password;

            $stmt = Flight::db()->prepare("SELECT password FROM user WHERE id = ? AND is_active = 1;");
            $stmt->bind_param('s', $token_data->user_id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (is_null($result) || !password_verify($old_password, $result['password'])) 
                Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password']));

            $enc_password = password_hash($new_password, PASSWORD_DEFAULT);
        
            $stmt = Flight::db()->prepare("UPDATE user SET password = ? WHERE id = ?");
            $stmt->bind_param('si', $enc_password, $token_data->user_id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        
            Flight::json(array('status' => 'success', 'message' => 'User password changed correctly'), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function delete($id) {
        $token_data = tokenData();
        if ($token_data->user_type != 'ADMIN')
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
        
            Flight::json(array('status' => 'success', 'message' => 'User deleted correctly'), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }
}