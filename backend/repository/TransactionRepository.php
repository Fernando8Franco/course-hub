<?php

namespace Repository;

use flight;
use Exception;

class TransactionRepository {
    public static function getAll() {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name,
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

    public static function getPendingTransactions() {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name,
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

    public static function getPendingTransactionsNoImage() {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name,
            c.id course_id, c.name course_name, c.is_active course_is_active
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            WHERE t.transaction_state = 'PENDING'
            AND t.image IS NULL
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

    public static function getCompletedTransactions() {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name,
            c.id course_id, c.name course_name, c.is_active course_is_active
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            WHERE t.transaction_state = 'COMPLET'
            AND t.image IS NOT NULL
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

    public static function getCanceledTransactions() {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name,
            c.id course_id, c.name course_name, c.is_active course_is_active
            FROM transaction t
            JOIN user u ON t.user_id = u.id
            JOIN course c ON t.course_id = c.id
            WHERE t.transaction_state = 'CANCEL'
            AND t.image IS NOT NULL
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

    public static function getOne($id) {
        try {
            $stmt = Flight::db()->prepare("SELECT t.id transaction_id, t.data_purchase, t.total_amount, t.transaction_state, t.image,
            u.id user_id, u.name, u.father_last_name, u.mother_last_name, u.is_active user_is_active,
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

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }
}