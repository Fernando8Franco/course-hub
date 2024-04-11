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

        Flight::halt(200, json_encode($result));
    }

    function getOne($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $result = UserRepository::getOne($id);    

        Flight::halt(200, json_encode($result));
    }

    function getOneByToken() {
        $token_data = tokenData();

        $result = UserRepository::getOneByToken($token_data->user_id);

        Flight::halt(200, json_encode($result));
    }

    function auth() {
        $data = Flight::request()->data;
        $email = $data->email ?? '';
        $password = $data->password ?? '';
        
        $result = UserRepository::getAuthInfo($email);
    
        if (!password_verify($password, $result['password'])) 
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password or email']));
        
        $token = encodeToken($result['id'], $result['user_type']);
    
        Flight::halt(200, json_encode(['token' => $token]));
    }

    function create($user_type) {
        $data = Flight::request()->data;

        if ($user_type == 'admin') {
            $token_data = tokenData();
            validateAdmin($token_data->user_type);

            UserRepository::save($user_type, $data);
            Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User stored correctly']));
        }

        $data->verification_code = generateVerificationCode();
        $id = UserRepository::verifyUser($data->email, 0);

        if (!is_null($id)) {
            $result = UserRepository::getLastResetRequest($data->email);
            validateRequestTime($result);
            UserRepository::eliminate($id);
        }

        UserRepository::save($user_type, $data);
        $body = EmailService::verifyEmail($data->verification_code);
        MailerService::sendEmail($data->email, 'Codigo de verificación', $body);

        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email sent correctly']));
    }

    function validateVerificationCode() {
        $data = Flight::request()->data;

        $id = UserRepository::verifyCode($data->email, $data->verification_code);

        UserRepository::deActivate($id, 1);

        $result = UserRepository::getAuthInfo($data->email);
    
        if (!password_verify($data->password, $result['password'])) 
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password or email']));
        
        $token = encodeToken($result['id'], $result['user_type']);
    
        Flight::halt(200, json_encode(['token' => $token]));
    }

    function sendResetPasswordEmail() {
        $data = Flight::request()->data;
        $email = $data->email;

        if (is_null(UserRepository::verifyUser($email, 1))) {
            usleep(2500000 + rand(100000, 699999));
            Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email send correctly']));
        }

        $result = UserRepository::getLastResetRequest($email);
        validateRequestTime($result);
    
        $token = UserRepository::updateResetToken($email);
    
        $body = EmailService::tokenEmail($token);
        MailerService::sendEmail($email, 'Cambio de contraseña',$body);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email sended correctly']));
    }

    function resetPassword() {
        $data = Flight::request()->data;
        $token =  hash('sha256', $data->token);
        $password = $data->password;
        
        $result = UserRepository::getResetInfor($token);
        
        if (is_null($result) || strtotime($result['reset_token_expires_at']) <= time())
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Token expired']));

        $enc_password = password_hash($password, PASSWORD_DEFAULT);
        UserRepository::updateResetPassword($enc_password, $result['id']);

        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User password changed correctly']));
    }

    function update() {
        $token_data = tokenData();
        $data = Flight::request()->data;

        if ($token_data->user_type === 'CUSTOMER') 
            $data->id = $token_data->user_id;
            
        UserRepository::update($data);

        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User updated correctly']));
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
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User password updated correctly']));
    }

    function deBanUser($id, $state) {
        $token_data = tokenData();

        if ($state !== '0' && $state !== '1')
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'State not valid']));

        validateAdmin($token_data->user_type);
        
        UserRepository::deActivate($id, $state, ($state) ? null : $_ENV['BAN_USER']);
    
        if ($state)
            Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User activated correctly']));
            
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User deactivated correctly']));    
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

function generateVerificationCode() {
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $verificationCode = '';
    for ($i = 0; $i < 6; $i++) {
        $verificationCode .= $characters[rand(0, strlen($characters) - 1)];
    }
    return ($verificationCode != $_ENV['BAN_USER']) ? $verificationCode : generateVerificationCode();
}

function validateRequestTime($time) {
    $last_reset_time = strtotime($time);
    $current_time = time();
    $time_difference = $current_time - $last_reset_time;

    if ($time_difference < 600) {
        $wait_time = 600 - $time_difference;
        Flight::halt(400, json_encode(['status' => 'warning', 'message' => $wait_time]));
    }
}