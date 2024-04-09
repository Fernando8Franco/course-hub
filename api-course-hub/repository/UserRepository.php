<?php

namespace Repository;

use Exception;
use flight;
use Exeption;

class UserRepository {
    public static function getAll() {
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, mother_last_name, birthday, phone_number, email, user_type, is_active FROM users");
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

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getOneByActive($id) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, mother_last_name, phone_number, email FROM user WHERE id = ? AND is_active = 1");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

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

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function verifyEmail($email, $id = null) {
        try {
            if (is_null($id)) {
                $stmt = Flight::db()->prepare("SELECT EXISTS (SELECT id FROM user WHERE email = ?) as email_exist");
                $stmt->bind_param('s', $email);
            } else {
                $stmt = Flight::db()->prepare("SELECT EXISTS (SELECT id FROM user WHERE email = ? AND id != ?) as email_exist");
                $stmt->bind_param('si', $email, $id);
            }
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

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
            $password = $data->password;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;
            $user_type = 'ADMIN';
            $is_active = $data->is_active;
            $enc_password = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt = Flight::db()->prepare("INSERT INTO user (name, father_last_name, mother_last_name, password, birthday, phone_number, email, user_type, is_active)
            VALUES (?,?,?,?,?,?,?,?,?);");
            $stmt->bind_param('ssssssssi', $name, $father_last_name, $mother_last_name, $enc_password, $birthday, $phone_number, $email, $user_type, $is_active);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function saveCostumer($data) {
        try {
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $password = $data->password;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;
            $user_type = 'COSTUMER';
            $is_active = $data->is_active;
            $enc_password = password_hash($password, PASSWORD_DEFAULT);

            $stmt = Flight::db()->prepare("INSERT INTO user (name, father_last_name, mother_last_name, password, birthday, phone_number, email, user_type, is_active)
            VALUES (?,?,?,?,?,?,?,?,?);");
            $stmt->bind_param('ssssssssi', $name, $father_last_name, $mother_last_name, $enc_password, $birthday, $phone_number, $email, $user_type, $is_active);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getLastResetRequest($email) {
        try {
            $stmt = Flight::db()->prepare("SELECT last_reset_request FROM user WHERE email = ?");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function updateToken($token, $expiry, $reset_request, $email) {
        try {
            $stmt = Flight::db()->prepare("UPDATE user SET reset_token_hash = ?, reset_token_expires_at = ?, last_reset_request = ? WHERE email = ?");
            $stmt->bind_param('ssss', $token, $expiry, $reset_request, $email);
            $stmt->execute();

            return $stmt->affected_rows;
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

    public static function updateByAdmin($data, $id) {
        try {
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $birthday = $data->birthday;
            $phone_number = $data->phone_number;
            $email = $data->email;
            $is_active = $data->is_active;

            $stmt = Flight::db()->prepare("UPDATE user SET name = ?, father_last_name = ?, mother_last_name = ?, birthday = ?, phone_number = ?, email = ?, is_active = ?
            WHERE id = ?");
            $stmt->bind_param('ssssssii', $name, $father_last_name, $mother_last_name, $birthday, $phone_number, $email, $is_active, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function updateByCostumer($data, $id) {
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
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function eliminate($id) {
        try {
            $stmt = Flight::db()->prepare("DELETE FROM user WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $rows = $stmt->affected_rows;
            $stmt->close();
            Flight::db()->close();

            return $rows;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }
}