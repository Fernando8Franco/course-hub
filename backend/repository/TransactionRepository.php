<?php

namespace Repository;

use flight;
use Exception;

class TransactionRepository {
    public static function getAll() {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name, u.email, u.phone_number,
            c.id course_id, c.name course_name, c.is_active course_is_active
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            AND u.is_active = 1
            ORDER BY t.data_purchase DESC;");
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            Flight::db()->close();

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getPendingTransactionsWithImage() {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name, u.email, u.phone_number,
            c.id course_id, c.name course_name, c.is_active course_is_active
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            WHERE t.transaction_state = 'PENDING'
            AND t.image IS NOT NULL
            AND u.is_active = 1
            ORDER BY t.data_purchase ASC;");
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            Flight::db()->close();

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getTransactionsByState($state) {
        try {
            $states = [
                1 => 'PENDING',
                2 => 'COMPLETED',
                3 => 'CANCELED'
            ];
            
            $transaction_state = $states[$state] ?? null;
            
            if ($transaction_state === null)
                Flight::halt(400, json_encode(['status' => 'error', 'message' => 'State does not exist']));

            $query = "SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name, u.email, u.phone_number,
            c.id course_id, c.name course_name, c.is_active course_is_active
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            WHERE t.transaction_state = ?
            AND u.is_active = 1
            AND t.image";

            $order_query = ($state == 1) ? "{$query} IS NULL ORDER BY u.id, t.data_purchase" : "{$query} IS NOT NULL ORDER BY t.data_purchase DESC";
            $stmt = Flight::db()->prepare($order_query);
            $stmt->bind_param('s', $transaction_state);
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
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name, u.email, u.phone_number,
            c.id course_id, c.name course_name, c.is_active course_is_active
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            WHERE t.id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

            if (is_null($result))
                throw new Exception("The transaction with id: {$id} dont exist");

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function getAllByToken($id) {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            c.name course_name, c.is_active course_is_active
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            AND u.is_active = 1
            AND u.id = ?
            ORDER BY t.data_purchase DESC;");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            Flight::db()->close();

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function courseIsActive($course_id) {
        try {
            $stmt = Flight::db()->prepare("SELECT is_active FROM course WHERE id = ?");
            $stmt->bind_param('i', $course_id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (is_null($result))
                throw new Exception("The course with id: {$course_id} dont exist");

            return $result['is_active'];
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function countWeekTransactions($user_id) {
        try {
            $current_date = date("Y-m-d");
            $start_of_week = date('Y-m-d', strtotime('monday this week', strtotime($current_date)));
            $end_of_week = date('Y-m-d', strtotime('sunday this week', strtotime($current_date)));

            $stmt = Flight::db()->prepare("SELECT COUNT(*) AS total_transactions FROM transaction WHERE user_id = ? AND data_purchase BETWEEN ? AND ?");
            $stmt->bind_param('iss', $user_id, $start_of_week, $end_of_week);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (is_null($result))
                throw new Exception("The user with id: {$user_id} dont exist");

            return $result['total_transactions'];
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function save($user_id, $data) {
        try {
            $data_purchase = date('Y-m-d H:i:s', time());
            $total_amount = $data->total_amount;
            $course_id = $data->course_id;

            $stmt = Flight::db()->prepare("INSERT INTO transaction (data_purchase, total_amount, user_id, course_id)
            VALUES (?,?,?,?)");
            $stmt->bind_param('sdii', $data_purchase, $total_amount, $user_id, $course_id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();

        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function update($id, $state) {
        try {
            $states = [
                1 => 'PENDING',
                2 => 'COMPLETED',
                3 => 'CANCELED'
            ];
            
            $transaction_state = $states[$state] ?? null;
            
            if ($transaction_state === null)
                Flight::halt(400, json_encode(['status' => 'error', 'message' => 'State does not exist']));

            $stmt = Flight::db()->prepare("UPDATE transaction SET transaction_state = ? WHERE id = ?");
            $stmt->bind_param('si', $transaction_state, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();           
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }
    
    public static function eliminate($id) {
        try {
            $stmt = Flight::db()->prepare("DELETE FROM transaction WHERE id = ?;");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $rows = $stmt->affected_rows;
            $stmt->close();
            Flight::db()->close();

            if ($rows == 0)
                throw new Exception("The user with id: {$id} dont exist");

        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }
}