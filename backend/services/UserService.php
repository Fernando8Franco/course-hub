<?php

namespace Services;

require_once 'TokenService.php';
use flight;
use Exception;
use Repository\UserRepository;

class UserService {
    function getAllByUserType($user_type) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
      
        $result = UserRepository::getAllByUserType($user_type);

        Flight::json($result, 200);
    }

    function getOne($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $result = UserRepository::getOne($id);    

        Flight::json($result, 200);
    }

    function getOneByToken() {
        $token_data = tokenData();

        $result = UserRepository::getOneByToken($token_data->user_id);

        Flight::json($result, 200);
    }

    function auth() {
        $data = Flight::request()->data;
        $email = $data->email ?? '';
        $password = $data->password ?? '';
        
        $result = UserRepository::getAuthInfo($email);
    
        if (!password_verify($password, $result['password'])) 
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password or email']));
        
        $token = encodeToken($result['id'], $result['user_type']);
    
        Flight::json(array('token' => $token), 200);
    }

    function createAdmin() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
      
        $data = Flight::request()->data;
    
        UserRepository::saveAdmin($data);
    
        Flight::json(array('status' => 'success', 'message' => 'User stored correctly'), 200);
    }

    function createCustomer() {
        $data = Flight::request()->data;
    
        UserRepository::saveCustomer($data);
    
        Flight::json(array('status' => 'success', 'message' => 'User stored correctly'), 200);
    }

    function sendResetPasswordEmail() {
        $data = Flight::request()->data;
        $email = $data->email;

        $result = UserRepository::getLastResetRequest($email);

        if (!$result) {
            $last_reset_time = strtotime($result);
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
    
        UserRepository::updateResetToken($token_hash, $expiry, $reset_request, $email);

        try {
            $mail = require "MailerService.php";

            $mail->setFrom('no-reply@gmail.com', 'GARZA COURSE HUB');
            $mail->addAddress($email);
            $mail->Subject = 'Cambio de contraseña';
            $mail->CharSet = 'UTF-8';
            $mail->Body = <<<END
            <html>
            <head>
                <style>
                    /* Estilos para el cuerpo del correo */
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                Haga click <a href="{$_ENV['HOST']}/reset-password/{$token}">aquí</a> para cambiar su contraseña.
            </body>
            </html>
            END;
                
            $mail->send();
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    
        Flight::json(array('status' => 'success', 'message' => 'Email send correctly'), 200);
    }

    function resetPassword() {
        $data = Flight::request()->data;
        $token = $data->token;
        $password = $data->password;

        $token_hash = hash('sha256', $token);
        
        $result = UserRepository::getResetInfor($token_hash);
        
        if (strtotime($result['reset_token_expires_at']) <= time())
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Token not valid']));

        $enc_password = password_hash($password, PASSWORD_DEFAULT);
        UserRepository::updateResetPassword($enc_password, $result['id']);

        Flight::json(array('status' => 'success', 'message' => 'User password changed correctly'), 200);
    }

    function update() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $data = Flight::request()->data;
    
        UserRepository::updateByAdmin($data);
    
        Flight::json(array('status' => 'success', 'message' => 'User changed correctly'), 200);
    }

    function updateCustomer() {
        $token_data = tokenData();

        validateCustomer($token_data->user_type);
        
        $data = Flight::request()->data;
    
        UserRepository::updateByCustomer($data, $token_data->user_id);
        
        Flight::json(array('status' => 'success', 'message' => 'User changed correctly'), 200);
    }

    function updatePassword() {
        $token_data = tokenData();

        $data = Flight::request()->data;
        $old_password = $data->old_password;
        $new_password = $data->new_password;

        $result = UserRepository::getAuthInfo(null, $token_data->user_id);

        if (!password_verify($old_password, $result['password'])) 
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password']));

        $enc_password = password_hash($new_password, PASSWORD_DEFAULT);
    
        UserRepository::updateResetPassword($enc_password, $token_data->user_id);
    
        Flight::json(array('status' => 'success', 'message' => 'User password changed correctly'), 200);
    }

    function deActivate($id, $state) {
        $token_data = tokenData();

        if ($state !== '0' && $state !== '1')
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'State not valid']));

        validateAdmin($token_data->user_type);
        
        UserRepository::deActivate($id, $state);
    
        if ($state)
            Flight::json(array('status' => 'success', 'message' => 'User activated correctly'), 200);
        else
            Flight::json(array('status' => 'success', 'message' => 'User deactivated correctly'), 200);
    }
}

function validateAdmin($user_type) {
    if ($user_type != 'ADMIN')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
}

function validateCustomer($user_type) {
    if ($user_type != 'CUSTOMER')
            Flight::halt(403, json_encode(['status' => 'error', 'message' => 'Unauthorized request']));
}