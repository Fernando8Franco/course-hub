<?php

namespace Services;

require_once 'TokenService.php';
use flight;
use Exception;
use Repository\CourseRepository;

class CourseService {
    function getAll() {
        $result = CourseRepository::getAll();

        Flight::json($result, 200);
    }

    function getOne($id) {
        $result = CourseRepository::getOne($id);

        Flight::json($result, 200);
    }

    function create() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        $data = Flight::request()->data;

        CourseRepository::save($data);
    
        Flight::json(array('status' => 'success', 'message' => 'School stored correctly'), 200);
    }

    function update() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        $data = Flight::request()->data;

        CourseRepository::update($data);
    
        Flight::json(array('status' => 'success', 'message' => 'School updated correctly'), 200);
    }

    function delete($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        CourseRepository::eliminate($id);
    
        Flight::json(array('status' => 'success', 'message' => 'School updated correctly'), 200);
    }
}