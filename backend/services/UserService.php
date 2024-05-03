<?php

namespace Services;

require_once 'TokenService.php';
use flight;
use Exception;
use Repository\UserRepository;
use DateTime;

class UserService {
    function getAllByUserType($user_type) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        $this->validateUserType($user_type);
      
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
        try {
            $data = Flight::request()->data;
            $email = $data->email;
            $password = $data->password;

            $this->isValidEmail($email);
        } catch (Exception $e) {
            Flight::error($e);
        }
        
        $token = $this->getToken($email, $password);
    
        Flight::halt(200, json_encode(['token' => $token]));
    }

    function create($user_type) {
        try {
            $data = Flight::request()->data;

            if ($data->count() > 7)
                throw new Exception('To many information');
            
            $this->validateData($data, ['verification_code', 'token', 'id', 'new_password']);
        } catch (Exception $e) {
            Flight::error($e);
        }

        $this->validateUserType($user_type);

        if ($user_type == 'admin') {
            $token_data = tokenData();
            validateAdmin($token_data->user_type);

            UserRepository::save($user_type, $data);
            Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User stored correctly']));
        }

        $data->verification_code = $this->generateVerificationCode();
        $id = UserRepository::verifyUser($data->email, 0);

        if (!is_null($id)) {
            $result = UserRepository::getLastResetRequest($data->email);
            $this->validateRequestTime($result);
            UserRepository::eliminate($id);
        }

        UserRepository::save($user_type, $data);

        // $body = EmailService::verifyEmail($data->verification_code);
        // MailerService::sendEmail($data->email, 'Codigo de verificación', $body);

        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email sent correctly']));
    }

    function validateVerificationCode() {
        try {
            $data = Flight::request()->data;
            $this->validateData($data, ['name', 'father_last_name', 'mother_last_name', 
            'birthday', 'phone_number', 'token', 'id', 'new_password']);
        } catch (Exception $e) {
            Flight::error($e);
        }

        $id = UserRepository::verifyCode($data->email, $data->verification_code);

        UserRepository::deActivate($id, 1);

        $result = UserRepository::getAuthInfo($data->email);
    
        if (!password_verify($data->password, $result['password'])) 
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password or email']));
        
        $token = encodeToken($result['id'], $result['user_type']);
    
        Flight::halt(200, json_encode(['token' => $token]));
    }

    function sendResetPasswordEmail() {
        try {
            $data = Flight::request()->data;
            $email = $data->email;
            $this->isValidEmail($email);
        } catch (Exception $e) {
            Flight::error($e);
        }

        if (is_null(UserRepository::verifyUser($email, 1))) {
            usleep(2500000 + rand(100000, 699999));
            Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email send correctly']));
        }

        $result = UserRepository::getLastResetRequest($email);
        $this->validateRequestTime($result);
    
        $token = UserRepository::updateResetToken($email);
    
        $body = EmailService::tokenEmail($token);
        MailerService::sendEmail($email, 'Cambio de contraseña',$body);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email sended correctly']));
    }

    function resetPassword() {
        try {
            $data = Flight::request()->data;
            $this->validateData($data, ['name', 'father_last_name', 'mother_last_name', 
            'birthday', 'phone_number', 'email', 'verification_code', 'id', 'new_password']);
            $token =  hash('sha256', $data->token);
            $password = $data->password;
        } catch (Exception $e) {
            Flight::error($e);
        }
        
        $result = UserRepository::getResetInfo($token);
        
        if (is_null($result) || strtotime($result['reset_token_expires_at']) <= time())
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Token expired']));

        $enc_password = password_hash($password, PASSWORD_DEFAULT);
        UserRepository::updateResetPassword($enc_password, $result['id']);

        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User password changed correctly']));
    }

    function update() {
        $token_data = tokenData();

        try {
            $data = Flight::request()->data;

            if ($token_data->user_type === 'CUSTOMER') {
                if ($data->count() > 6)
                    throw new Exception('To many information');
                $data->id = $token_data->user_id;
            }

            $this->validateData($data, ['password','verification_code', 'token', 'new_password']);
        } catch (Exception $e) {
            Flight::error($e);
        }  
            
        UserRepository::update($data);

        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User updated correctly']));
    }

    function updatePassword() {
        $token_data = tokenData();

        try {
            $data = Flight::request()->data;
            $this->validateData($data, ['name', 'father_last_name', 'mother_last_name', 
            'birthday', 'phone_number', 'email', 'verification_code', 'token','id']);
            $old_password = $data->password;
            $new_password = $data->new_password;
        } catch (Exception $e) {
            Flight::error($e);
        } 

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

    function delete($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        UserRepository::eliminateHard($id);

        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'User deleted correctly']));
    }


    // PRIVATE FUNCTIONS

    private function getToken($email, $password) {
        $result = UserRepository::getAuthInfo($email);
    
        if (!password_verify($password, $result['password'])) 
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'Wrong password or email']));
        
        $token = encodeToken($result['id'], $result['user_type']);

        return $token;
    }

    private function validateUserType($user_type) {
        if ($user_type != 'admin' && $user_type != 'customer')
                Flight::halt(400, json_encode(['status' => 'error', 'message' => "The user type: {$user_type} does not exist"]));
    }

    private function generateVerificationCode() {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $verificationCode = '';
        for ($i = 0; $i < 6; $i++) {
            $verificationCode .= $characters[rand(0, strlen($characters) - 1)];
        }
        return ($verificationCode != $_ENV['BAN_USER']) ? $verificationCode : $this->generateVerificationCode();
    }

    private function validateData($data, $skip_value = []) {
        $rules = [
            'name' => ['max_length' => 40, 'error' => 'Not valid name'],
            'father_last_name' => ['max_length' => 40, 'error' => 'Not valid father last name'],
            'mother_last_name' => ['max_length' => 40, 'error' => 'Not valid mother last name'],
            'password' => ['max_length' => 50, 'error' => 'Not valid password'],
            'birthday' => ['date_format' => 'Y-m-d', 'error' => 'Not valid birthday'],
            'phone_number' => ['max_length' => 15, 'is_numeric' => true,'error' => 'Not valid phone number'],
            'email' => ['max_length' => 60, 'email' => true, 'error' => 'Not valid email'],
            'verification_code' => ['max_length' => 6, 'error' => 'Not valid verification code'],
            'token' => ['Not valid token'],
            'id' => ['Not valid id'],
            'new_password' => ['max_length' => 50, 'error' => 'Not valid password']
        ];
    
        foreach ($rules as $field => $rule) {
            $value = $data->{$field} ?? null;
            if (!empty($skip_value) && in_array($field, $skip_value))
                continue;

            if (empty($value))
                throw new Exception("The field {$field} can not be empty");

            if (isset($rule['max_length']) && strlen($value) > $rule['max_length'])
                throw new Exception("The field {$field} only can have {$rule['max_length']} characters");

            if (isset($rule['date_format']) && !$this->isValidDate($value))
                throw new Exception($rule['error']);

            if (isset($rule['is_numeric']) && $rule['is_numeric'] && !ctype_digit($value))
                throw new Exception($rule['error']);

            if (isset($rule['email']) && !filter_var($value, FILTER_VALIDATE_EMAIL))
                throw new Exception($rule['error']);
        }
    }
    
    private function isValidDate($date) {
        $timestamp = strtotime($date);
        return ($timestamp == true);
    }    

    private function isValidEmail($email) {
        if(empty($email) || (strlen($email) > 60 || !filter_var($email, FILTER_VALIDATE_EMAIL)))
            throw new Exception('Not valid email');
    }

    private function validateRequestTime($time) {
        $last_reset_time = strtotime($time);
        $current_time = time();
        $time_difference = $current_time - $last_reset_time;
    
        if ($time_difference < 600) {
            $wait_time = 600 - $time_difference;
            Flight::halt(206, json_encode(['status' => 'warning', 'message' => $wait_time]));
        }
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