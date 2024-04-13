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

        Flight::halt(200, json_encode($result));
    }

    function getOne($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $result = SchoolRepository::getOne($id);    

        Flight::halt(200, json_encode($result));
    }

    function create() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        $data = Flight::request()->data;

        SchoolRepository::save($data);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'School stored correctly']));
    }

    function update() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        $data = Flight::request()->data;

        SchoolRepository::update($data);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'School updated correctly']));
    }

    function delete($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        SchoolRepository::eliminate($id);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'School deleted correctly']));
    }
}

