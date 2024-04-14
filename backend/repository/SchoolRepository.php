<?php

namespace Repository;

use flight;
use Exception;

class SchoolRepository {
    public static function getAll() {
        try {
            $stmt = Flight::db()->prepare("SELECT * FROM school 
            ORDER BY is_active DESC, name ASC");
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
            $stmt = Flight::db()->prepare("SELECT * FROM school WHERE id = ?");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

            if (is_null($result))
                throw new Exception("The school with id: {$id} does not exist");

            return $result;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function save($data) {
        try {
            $name = $data->name;

            $stmt = Flight::db()->prepare("INSERT INTO school (name) VALUES (?);");
            $stmt->bind_param('s', $name);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function update($data) {
        try {
            $id = $data->id;
            $name = $data->name;

            $stmt = Flight::db()->prepare("UPDATE school SET name = ? WHERE id = ?;");
            $stmt->bind_param('si', $name, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function deActivate($id, $state) {
        try {
            $stmt = Flight::db()->prepare("UPDATE school  SET is_active = ? WHERE id = ?");
            $stmt->bind_param('ii', $state, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function eliminate($id) {
        Flight::db()->begin_transaction();
        try {
            $stmt = Flight::db()->prepare("DELETE FROM transaction WHERE course_id = (SELECT id FROM course WHERE school_id = ?);");
            $stmt->bind_param('i', $id);
            $stmt->execute();

            $stmt = Flight::db()->prepare("DELETE FROM course WHERE school_id = ?;");
            $stmt->bind_param('i', $id);
            $stmt->execute();

            $stmt = Flight::db()->prepare("DELETE FROM school WHERE id = ?;");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $rows = $stmt->affected_rows;

            if ($rows == 0)
                throw new Exception("The school with id: {$id} does not exist");
            
            Flight::db()->commit();
        } catch (Exception $e) {
            Flight::db()->rollback();
            Flight::error($e);
        }
    
        $stmt->close();
        Flight::db()->close();
    }
}