<?php

namespace Services;
require_once 'TokenService.php';
use flight;
use Exception;
use Repository\UserRepository;

class UserService {
    function getAll() {
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
      
        $result = UserRepository::getAll();

        Flight::json($result, 200);
    }

    function getOne($id) {
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        $result = UserRepository::getOne($id);    

        Flight::json($result, 200);
    }

    function getOneByToken() {
        $token_data = tokenData();

        $result = UserRepository::getOneByActive($token_data->user_id);

        if (is_null($result))
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'The user is not active']));

        Flight::json($result, 200);
    }

    function auth() {
        $data = Flight::request()->data;
        $email = $data->email ?? '';
        $password = $data->password ?? '';
        
        $result = UserRepository::getAuthInfo($email);
    
        if (is_null($result) || !password_verify($password, $result['password'])) 
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password or user']));
        
        $token = encodeToken($result['id'], $result['user_type']);
    
        Flight::json(array('token' => $token), 200);
    }

    function createAdmin() {
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
      
        $data = Flight::request()->data;
        $email = $data->email;

        $result = UserRepository::verifyEmail($email);

        if ($result['email_exist']) 
            Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
    
        UserRepository::saveAdmin($data);
    
        Flight::json(array('status' => 'success', 'message' => 'User stored correctly'), 200);
    }

    function createCostumer() {
        $data = Flight::request()->data;
        $email = $data->email;

        $result = UserRepository::verifyEmail($email);

        if ($result['email_exist']) 
            Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
    
        UserRepository::saveCostumer($data);
    
        Flight::json(array('status' => 'success', 'message' => 'User stored correctly'), 200);
    }

    function sendResetPasswordEmail() {
        $data = Flight::request()->data;
        $email = $data->email;

        $result = UserRepository::getLastResetRequest($email);

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
        $expiry = date('Y-m-d H:i:s', time() + 1800);
        $reset_request = date('Y-m-d H:i:s', time());
    
        $affected_rows = UserRepository::updateToken($token_hash, $expiry, $reset_request, $email);

        if ($affected_rows == 0)
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
                
            $mail->send();
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    
        Flight::json(array('status' => 'success', 'message' => 'Email send correctly'), 200);
        
    }

    function resetPassword() {
        try {
            $data = Flight::request()->data;
            $token = $data->token;
            $password = $data->password;

            $token_hash = hash('sha256', $token);
            
            $result = UserRepository::getResetInfor($token_hash);
            
            if (is_null($result) || strtotime($result['reset_token_expires_at']) <= time())
                Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Token not valid']));

            $enc_password = password_hash($password, PASSWORD_DEFAULT);
            UserRepository::updateResetPassword($enc_password, $result['id']);

            Flight::json(array('status' => 'success', 'message' => 'User password changed correctly'), 200);
        } catch (Exception $e) {
            Flight::json(array('status' => 'error', 'message' => $e->getMessage()), 400);
        }
    }

    function update($id) {
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        $data = Flight::request()->data;
        $email = $data->email;

        $result = UserRepository::verifyEmail($email, $id);

        if ($result['email_exist']) 
            Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
    
        UserRepository::updateByAdmin($data, $id);
    
        Flight::json(array('status' => 'success', 'message' => 'User changed correctly'), 200);
    }

    function updateCostumer() {
        $token_data = tokenData();

        if ($token_data->user_type != 'COSTUMER')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        $data = Flight::request()->data;
        $email = $data->email;

        $result = UserRepository::verifyEmail($email, $token_data->user_id);

        if ($result['email_exist']) 
            Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
    
        UserRepository::updateByCostumer($data, $token_data->user_id);
        
        Flight::json(array('status' => 'success', 'message' => 'User changed correctly'), 200);
    }

    function updatePassword() {
        $token_data = tokenData();

        $data = Flight::request()->data;
        $old_password = $data->old_password;
        $new_password = $data->new_password;

        $result = UserRepository::getAuthInfo(null, $token_data->user_id);

        if (is_null($result) || !password_verify($old_password, $result['password'])) 
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password']));

        $enc_password = password_hash($new_password, PASSWORD_DEFAULT);
    
        UserRepository::updateResetPassword($enc_password, $token_data->user_id);
    
        Flight::json(array('status' => 'success', 'message' => 'User password changed correctly'), 200);
    }

    function delete($id) {
        $token_data = tokenData();

        if ($token_data->user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
        
        $rows = UserRepository::eliminate($id);

        if ($rows == 0)
            Flight::halt(200, json_encode(['status' => 'warning', 'message' => "The user with id: {$id} dont exist"]));
    
        Flight::json(array('status' => 'success', 'message' => 'User deleted correctly'), 200);
    }
}