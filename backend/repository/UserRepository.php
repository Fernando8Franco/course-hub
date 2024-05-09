<?php

namespace Repository;

use Ramsey\Uuid\Uuid;
use Exception;
use flight;

class UserRepository {
    public static function getAllByUserType($user_type) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, 
            mother_last_name, birthday, phone_number, email, user_type, 
            is_active, verification_code
            FROM user 
            WHERE user_type = ?
            ORDER BY is_active DESC, verification_code DESC, name ASC");
            $stmt->bind_param('s', $user_type);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            Flight::db()->close();

            return $result;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function getOne($id) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, father_last_name, 
            mother_last_name, birthday, phone_number, email, user_type, is_active 
            FROM user 
            WHERE id = ?");
            $stmt->bind_param('s', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

            if (is_null($result))
                throw new Exception("The user with id: {$id} does not exist");

            return $result;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function getOneByToken($id) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, name, birthday, father_last_name, 
            mother_last_name, phone_number, email, user_type
            FROM user 
            WHERE id = ? 
            AND is_active = 1");
            $stmt->bind_param('s', $id);
            $stmt->execute();
            $user = $stmt->get_result()->fetch_assoc();

            if (is_null($user))
                throw new Exception('The user not exist');

            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.date_purchase, 
            t.total_amount, t.transaction_state, t.image,
            c.name course_name
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            AND u.is_active = 1 AND u.id = ?
            ORDER BY c.is_active DESC, t.date_purchase DESC;");
            $stmt->bind_param('s', $id);
            $stmt->execute();
            $transactions = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $user['transactions'] = $transactions;

            return $user;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function getAuthInfo($email = null, $id = null) {
        try {
            if (!is_null($email)) {
                $stmt = Flight::db()->prepare("SELECT password, id, user_type 
                FROM user 
                WHERE email = ? 
                AND is_active = 1;");
                $stmt->bind_param('s', $email);
            } else {
                $stmt = Flight::db()->prepare("SELECT password FROM user 
                WHERE id = ? 
                AND is_active = 1;");
                $stmt->bind_param('s', $id);
            }
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (is_null($result) && !is_null($email)) 
                throw new Exception('Wrong password or email');
            else if (is_null($result) && !is_null($id))
                throw new Exception('The user is not active');

            return $result;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function verifyUser($email, $is_active) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, verification_code 
            FROM user 
            WHERE email = ? 
            AND is_active = ?");
            $stmt->bind_param('si', $email, $is_active);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (!is_null($result) && $result['verification_code'] == $_ENV['BAN_USER']) {
                usleep(2500000 + rand(100000, 699999));
                Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Email sent correctly']));   
            }

            return (is_null($result)) ? null : $result['id'];
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function save($user_type, $data) {
        try {
            $id = Uuid::uuid4();
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $password = password_hash($data->password, PASSWORD_DEFAULT);
            $birthday = date("Y/m/d", strtotime($data->birthday));
            $phone_number = $data->phone_number;
            $email = $data->email;
            $last_reset_request = date('Y-m-d H:i:s', time());
            $verification_code = $data->verification_code;
            
            $stmt = Flight::db()->prepare("INSERT INTO user (id, name, father_last_name, 
            mother_last_name, password, birthday, phone_number, email, user_type, 
            last_reset_request, verification_code)
            VALUES (?,?,?,?,?,?,?,?,?,?,?);");
            $stmt->bind_param('sssssssssss', $id, $name, $father_last_name, 
            $mother_last_name, $password, $birthday, $phone_number, $email, $user_type, 
            $last_reset_request, $verification_code);
            $stmt->execute();

            if ($user_type == 'ADMIN') {
                $stmt->close();
                Flight::db()->close();
            }
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function updateVerifyCode($data) {
        try {
            $email = $data->email;
            $verification_code = $data->verification_code;
            $last_reset_request = date('Y-m-d H:i:s', time());

            $stmt = Flight::db()->prepare("UPDATE user SET verification_code = ?,
            last_reset_request = ?
            WHERE email = ?
            AND verification_code IS NOT NULL
            AND verification_code != ?");
            $stmt->bind_param('ssss', $verification_code, $last_reset_request, $email, $_ENV['BAN_USER']);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function verifyCode($email, $verification_code) {
        try {
            $stmt = Flight::db()->prepare("SELECT id 
            FROM user
            WHERE email = ?
            AND verification_code = ?
            AND verification_code != ?
            AND is_active = 0");
            $stmt->bind_param('sss', $email, $verification_code, $_ENV['BAN_USER']);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (is_null($result)) {
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'Wrong verification code']));
            }

            return $result['id'];
        } catch (Exception $e) {
            Flight::error($e);
        } 
    }

    public static function getLastResetRequest($email) {
        try {
            $stmt = Flight::db()->prepare("SELECT last_reset_request 
            FROM user 
            WHERE email = ?");
            $stmt->bind_param('s', $email);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            return $result['last_reset_request'];
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function updateResetToken($email) {
        try {
            $token = bin2hex(random_bytes(16));
            $token_hash = hash('sha256', $token);
            $expiry = date('Y-m-d H:i:s', time() + 900);
            $reset_request = date('Y-m-d H:i:s', time());

            $stmt = Flight::db()->prepare("UPDATE user SET reset_token_hash = ?, 
            reset_token_expires_at = ?, last_reset_request = ? 
            WHERE email = ?");
            $stmt->bind_param('ssss', $token_hash, $expiry, $reset_request, $email);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();

            return $token;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function getResetInfo($token) {
        try {
            $stmt = Flight::db()->prepare("SELECT id, reset_token_expires_at 
            FROM user 
            WHERE reset_token_hash = ?");
            $stmt->bind_param('s', $token);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            return $result;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function update($data) {
        try {
            $id = $data->id;
            $name = $data->name;
            $father_last_name = $data->father_last_name;
            $mother_last_name = $data->mother_last_name;
            $birthday = date("Y/m/d", strtotime($data->birthday));
            $phone_number = $data->phone_number;
            $email = $data->email;

            $stmt = Flight::db()->prepare("UPDATE user SET name = ?, father_last_name = ?, 
            mother_last_name = ?, birthday = ?, phone_number = ?, email = ?
            WHERE id = ?");
            $stmt->bind_param('sssssss', $name, $father_last_name, 
            $mother_last_name, $birthday, $phone_number, $email, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function updateResetPassword($password, $id) {
        try {
            $stmt = Flight::db()->prepare("UPDATE user 
            SET password = ?, reset_token_hash = NULL, reset_token_expires_at = NULL 
            WHERE id = ?");
            $stmt->bind_param('ss', $password, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function deActivate($id, $state, $code = null) {
        try {
            $stmt = Flight::db()->prepare("UPDATE user 
            SET is_active = ?, verification_code = ? 
            WHERE id = ?");
            $stmt->bind_param('iss', $state, $code, $id);
            $stmt->execute();
            if (!is_null($code)) {
                $stmt->close();
                Flight::db()->close();
            }
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function eliminate($id) {
        try {
            $stmt = Flight::db()->prepare("DELETE FROM user 
            WHERE id = ? 
            AND is_active = 0 
            AND verification_code != ?");
            $stmt->bind_param('ss', $id, $_ENV['BAN_USER']);
            $stmt->execute();
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function eliminateHard($id) {
        Flight::db()->begin_transaction();
        try {
            $stmt = Flight::db()->prepare("DELETE FROM transaction WHERE user_id = ?");
            $stmt->bind_param('s', $id);
            $stmt->execute();

            $stmt = Flight::db()->prepare("DELETE FROM user WHERE id = ?");
            $stmt->bind_param('s', $id);
            $stmt->execute();

            $rows = $stmt->affected_rows;

            if ($rows == 0)
                throw new Exception("The user with id: {$id} does not exist");

            Flight::db()->commit();
        } catch (Exception $e) {
            Flight::db()->rollback();
            Flight::error($e);
        }

        $stmt->close();
        Flight::db()->close();
    }
}