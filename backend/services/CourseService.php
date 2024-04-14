<?php

namespace Services;

require_once 'TokenService.php';
use flight;
use Exception;
use Repository\CourseRepository;

class CourseService {
    function getAll() {
        $result = CourseRepository::getAll();

        Flight::halt(200, json_encode($result));
    }

    function getAllByAdmin() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $result = CourseRepository::getAllByAdmin();

        Flight::halt(200, json_encode($result));
    }

    function getOne($id) {
        $result = CourseRepository::getOne($id);

        Flight::halt(200, json_encode($result));
    }

    function create() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        try {
            $data = Flight::request()->data;
            $image = Flight::request()->files->image;
            
            if ($data->count() > 6)
                throw new Exception('To many information');
        
            $this->validateData($data, ['id']);
            $this->validateImage($image);
        } catch (Exception $e) {
            Flight::error($e);
        }

        CourseRepository::save($data, $image);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Course stored correctly']));
    }

    function update() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        try {
            $data = Flight::request()->data;
            $image = Flight::request()->files->image;
            
            if ($data->count() > 7)
                throw new Exception('To many information');
        
            $this->validateData($data);
            $this->validateImage($image);
        } catch (Exception $e) {
            Flight::error($e);
        }

        CourseRepository::update($data, $image);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Course updated correctly']));
    }

    function deActivate($id, $state) {
        $token_data = tokenData();
        validateAdmin($token_data->user_type);

        if (!ctype_digit($id))
                throw new Exception('Not valid id');
        if ($state !== '0' && $state !== '1')
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'State not valid']));
        
        CourseRepository::deActivate($id, $state);
    
        if ($state)
            Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Course activated correctly']));
            
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Course deactivated correctly'])); 
    }

    function delete($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        CourseRepository::eliminate($id);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Course deleted correctly']));
    }

    private function validateData($data, $skip_value = []) {
        $rules = [
            'name' => ['max_length' => 80, 'error' => 'Not valid course name'],
            'description' => ['error' => 'Not valid description'],
            'price' => ['is_float' => true, 'error' => 'Not valid price value'],
            'instructor' => ['max_length' => 80, 'error' => 'Not valid instructor name'],
            'modality' => ['enum' => ['REMOTE', 'ON-SITE', 'HYBRID'], 'error' => 'Not valid modality'],
            'school_id' => ['is_numeric' => true, 'error' => 'Not valid school id'],
            'id' => ['is_numeric' => true, 'error' => 'Not valid course id']
        ];
    
        foreach ($rules as $field => $rule) {
            $value = $data->{$field} ?? null;
            if (!empty($skip_value) && in_array($field, $skip_value))
                continue;

            if (empty($value))
                throw new Exception("The field {$field} can not be empty");

            if (isset($rule['max_length']) && strlen($value) > $rule['max_length'])
                throw new Exception("The field {$field} only can have {$rule['max_length']} characters");

            if (isset($rule['enum']) && !in_array($value, $rule['enum']))
                throw new Exception("The field {$field} only can be: " . implode(" / ", $rule['enum']));

            if (isset($rule['is_numeric']) && !ctype_digit($value))
                throw new Exception($rule['error']);

            if (isset($rule['is_float']) && !filter_var($value, FILTER_VALIDATE_FLOAT))
                throw new Exception($rule['error']);
        }
    }

    private function validateImage($image) {
        if (empty($image))
            throw new Exception('The field image can not be empty');

        if ($image['size'] > 500000)
            throw new Exception('The image can not size more than 500KB');

        $fileType = strtolower(pathinfo($image['full_path'],PATHINFO_EXTENSION));
        if ($fileType != "jpg" && $fileType != "png" && $fileType != "jpeg")
            throw new Exception('File type not accepted only JPG, JPEG or PNG');

        return $fileType;
    }
}