<?php

namespace Repository;
use flight;
use Exception;

class SchoolRepository {
    public static function getAll() {
        try {
            $stmt = Flight::db()->prepare("SELECT * FROM school");
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
            $stmt = Flight::db()->prepare("SELECT * FROM school WHERE id = ?");
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

    public static function verifySchool($name) {
        try {
            $stmt = Flight::db()->prepare("SELECT EXISTS (SELECT id FROM school WHERE name = ?) as school_exist");
            $stmt->bind_param('s', $name);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            return $result;
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function save($name) {
        try {
            $stmt = Flight::db()->prepare("INSERT INTO school (name) VALUES (?);");
            $stmt->bind_param('s', $name);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The school is already registered']));
            else
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function update($id, $name) {
        try {
            $stmt = Flight::db()->prepare("UPDATE school SET name = ? WHERE id = ?;");
            $stmt->bind_param('si', $name, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The school is already registered']));
            else
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function eliminate($id) {
        try {
            $stmt = Flight::db()->prepare("DELETE FROM school WHERE id = ?;");
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