<?php

namespace Services;

require_once 'TokenService.php';
use flight;
use Exception;
use Repository\SchoolRepository;

class SchoolService {
    function getAll() {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = SchoolRepository::getAll();

        Flight::json($result, 200);
    }

    function getOne($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $result = SchoolRepository::getOne($id);    

        Flight::json($result, 200);
    }

    function create() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        $data = Flight::request()->data;
        $name = $data->name;

        SchoolRepository::save($name);
    
        Flight::json(array('status' => 'success', 'message' => 'School stored correctly'), 200);
    }

    function update() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        $data = Flight::request()->data;
        $id = $data->id;
        $name = $data->name;

        SchoolRepository::update($id, $name);
    
        Flight::json(array('status' => 'success', 'message' => 'School updated correctly'), 200);
    }

    function delete($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        SchoolRepository::eliminate($id);
    
        Flight::json(array('status' => 'success', 'message' => 'School deleted correctly'), 200);
    }
}

