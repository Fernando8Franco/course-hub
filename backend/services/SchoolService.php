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

        try {
            $data = Flight::request()->data;
            if (empty($data->name))
                throw new Exception('The field name can not be empty');
            if (strlen($data->name) > 150)
                throw new Exception('The field name only can have 150 characters');
        } catch (Exception $e) {
            Flight::error($e);
        }

        SchoolRepository::save($data);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'School stored correctly']));
    }

    function update() {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        try {
            $data = Flight::request()->data;
            if (empty($data->id))
                throw new Exception('The field id can not be empty');
            if (!ctype_digit($data->id))
                throw new Exception('Not valid id');
            if (empty($data->name))
                throw new Exception('The field name can not be empty');
            if (strlen($data->name) > 150)
                throw new Exception('The field name only can have 150 characters');
        } catch (Exception $e) {
            Flight::error($e);
        }

        SchoolRepository::update($data);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'School updated correctly']));
    }

    function deActivate($id, $state) {
        $token_data = tokenData();
        validateAdmin($token_data->user_type);

        if (!ctype_digit($id))
                throw new Exception('Not valid id');
        if ($state !== '0' && $state !== '1')
            Flight::halt(400, json_encode(['status' => 'error', 'message' => 'State not valid']));

        
        SchoolRepository::deActivate($id, $state);
    
        if ($state)
            Flight::halt(200, json_encode(['status' => 'success', 'message' => 'School activated correctly']));
            
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'School deactivated correctly']));    
    }

    function delete($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        SchoolRepository::eliminate($id);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'School deleted correctly']));
    }
}

