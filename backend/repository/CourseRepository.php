<?php

namespace Repository;

use flight;
use Exception;

class CourseRepository {
    public static function getAll() {
        try {
            $stmt = Flight::db()->prepare("SELECT c.id, c.name, c.description, c.price, c.instructor, c.modality, c.image, s.name 
            FROM course c JOIN school s ON c.school_id = s.id 
            AND c.is_active AND s.is_active;");
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
            $stmt = Flight::db()->prepare("SELECT c.id, c.name, c.description, c.price, c.instructor, c.modality, c.image, s.name 
            FROM course c JOIN school s ON c.school_id = s.id 
            AND c.is_active AND s.is_active AND c.id = ?;");
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

    public static function save($data) {
        try {
            $name = $data->name;
            $description = $data->description;
            $price = $data->price;
            $instructor = $data->instructor;
            $modality = $data->modality;
            $image = $data->image;
            $is_active = $data->is_active;
            $school_id = $data->school_id;

            $stmt = Flight::db()->prepare("INSERT INTO course (name, description, price, instructor, modality, image, is_active, school_id) 
            VALUES (?,?,?,?,?,?,?,?);");
            $stmt->bind_param('ssdsssii', $name, $description, $price, $instructor, $modality, $image, $is_active, $school_id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The image name is already registered']));
            else
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function update($data) {
        try {
            $id = $data->id;
            $name = $data->name;
            $description = $data->description;
            $price = $data->price;
            $instructor = $data->instructor;
            $modality = $data->modality;
            $image = $data->image;
            $is_active = $data->is_active;
            $school_id = $data->school_id;

            $stmt = Flight::db()->prepare("UPDATE course SET name = ?, description = ?, price = ?, instructor = ?, modality = ?, image = ?, is_active = ?, school_id = ?
            WHERE id = ?");
            $stmt->bind_param('ssdsssiii', $name, $description, $price, $instructor, $modality, $image, $is_active, $school_id, $id);
            $stmt->execute();
            $rows = $stmt->affected_rows;
            $stmt->close();
            Flight::db()->close();

            if ($rows == 0)
                throw new Exception("The user with id: {$id} dont exist");
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The image name is already registered']));
            else
                Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }

    public static function eliminate($id) {
        try {
            $stmt = Flight::db()->prepare("DELETE FROM course WHERE id = ?;");
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