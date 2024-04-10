<?php

namespace Repository;

use Exception;
use flight;

class UserRepository {
    public static function getAllByUserType($user_type) {
        try {
            if ($user_type != 'admin' && $user_type != 'customer')
                throw new Exception("The user type: {$user_type} dont exist");

            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, mother_last_name, birthday, phone_number, email, user_type, is_active FROM user 
            WHERE user_type = ?
            ORDER BY is_active DESC, id ASC");
            $stmt->bind_param('s', $user_type);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            Flight::db()->close();

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getOne($id) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, mother_last_name, birthday, phone_number, email, user_type, is_active FROM user WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

            if (is_null($result))
                throw new Exception("The user with id: {$id} dont exist");

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getOneByToken($id) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, mother_last_name, phone_number, email FROM user WHERE id = ? AND is_active = 1");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

            if (is_null($result))
                throw new Exception('The user is not active');

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getAuthInfo($email = null, $id = null) {
        try {
            if (!is_null($email)) {
                $stmt = Flight::db()->prepare("SELECT password, id, user_type FROM user WHERE email = ? AND is_active = 1;");
                $stmt->bind_param('s', $email);
            } else {
                $stmt = Flight::db()->prepare("SELECT password FROM user WHERE id = ? AND is_active = 1;");
                $stmt->bind_param('i', $id);
            }
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (is_null($result) && !is_null($email)) 
                throw new Exception('Wrong password or email');
            else if (is_null($result) && !is_null($id))
                throw new Exception('Wrong password');

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function saveAdmin($data) {
        try {
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $password = password_hash($data->password, PASSWORD_DEFAULT);
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;
            $user_type = 'ADMIN';
            
            $stmt = Flight::db()->prepare("INSERT INTO user (name, father_last_name, mother_last_name, password, birthday, phone_number, email, user_type)
            VALUES (?,?,?,?,?,?,?,?);");
            $stmt->bind_param('ssssssss', $name, $father_last_name, $mother_last_name, $password, $birthday, $phone_number, $email, $user_type);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
            else
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function saveCustomer($data) {
        try {
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $password = password_hash($data->password, PASSWORD_DEFAULT);
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;
            $user_type = 'CUSTOMER';

            $stmt = Flight::db()->prepare("INSERT INTO user (name, father_last_name, mother_last_name, password, birthday, phone_number, email, user_type)
            VALUES (?,?,?,?,?,?,?,?);");
            $stmt->bind_param('ssssssss', $name, $father_last_name, $mother_last_name, $password, $birthday, $phone_number, $email, $user_type);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
            else
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getLastResetRequest($email) {
        try {
            $stmt = Flight::db()->prepare("SELECT last_reset_request FROM user WHERE email = ?");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            return $result['last_reset_request'];
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function updateResetToken($token, $expiry, $reset_request, $email) {
        try {
            $stmt = Flight::db()->prepare("UPDATE user SET reset_token_hash = ?, reset_token_expires_at = ?, last_reset_request = ? WHERE email = ?");
            $stmt->bind_param('ssss', $token, $expiry, $reset_request, $email);
            $stmt->execute();
            $rows = $stmt->affected_rows;
            $stmt->close();
            Flight::db()->close();

            if ($rows == 0)
                Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email send correctly']));
            
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getResetInfor($token) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, reset_token_expires_at FROM user WHERE reset_token_hash = ?");
            $stmt->bind_param('s', $token);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (is_null($result)) 
                throw new Exception('Token not valid');

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function updateResetPassword($password, $id) {
        try {
            $stmt = Flight::db()->prepare("UPDATE user SET password = ?, reset_token_hash = NULL, reset_token_expires_at = NULL WHERE id = ?");
            $stmt->bind_param('si', $password, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function updateByAdmin($data) {
        try {
            $id = $data->id;
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;

            $stmt = Flight::db()->prepare("UPDATE user SET name = ?, father_last_name = ?, mother_last_name = ?, birthday = ?, phone_number = ?, email = ?, is_active = ?
            WHERE id = ?");
            $stmt->bind_param('ssssssi', $name, $father_last_name, $mother_last_name, $birthday, $phone_number, $email, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
            else
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function updateByCustomer($data, $id) {
        try {
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;

            $stmt = Flight::db()->prepare("UPDATE user SET name = ?, father_last_name = ?, mother_last_name = ?, birthday = ?, phone_number = ?, email = ?
            WHERE id = ?");
            $stmt->bind_param('ssssssi', $name, $father_last_name, $mother_last_name, $birthday, $phone_number, $email, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
            else
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function deActivate($id, $state) {
        try {
            $stmt = Flight::db()->prepare("UPDATE user SET is_active = ? WHERE id = ? AND id != 1");
            $stmt->bind_param('ii', $state, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'The user'))
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }    
}