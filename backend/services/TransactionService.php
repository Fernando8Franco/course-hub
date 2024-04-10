<?php

namespace Services;

require_once 'TokenService.php';
use flight;
use Exception;
use Repository\TransactionRepository;

class TransactionService {
    function getAll() {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getAll();

        Flight::json($result, 200);
    }

    function getPendingTransactionsWithImage() {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getPendingTransactionsWithImage();

        Flight::json($result, 200);
    }

    function getTransactionsByState($state) {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getTransactionsByState($state);

        Flight::json($result, 200);
    }

    function getOne($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $result = TransactionRepository::getOne($id);    

        Flight::json($result, 200);
    }

    function getAllByToken() {
        $token_data = tokenData();

        validateCustomer($token_data->user_type);

        $result = TransactionRepository::getAllByToken($token_data->user_id);

        Flight::json($result, 200);
    }

    function create() {
        $token_data = tokenData();

        validateCustomer($token_data->user_type);
        
        $data = Flight::request()->data;

        if (!TransactionRepository::courseIsActive($data->course_id))
            Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The course is not available']));

        $week_transactions = TransactionRepository::countWeekTransactions($token_data->user_id);

        if ($week_transactions >= 7)
            Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'Transaction limit has been reached']));

        TransactionRepository::save($token_data->user_id, $data);

        Flight::json(array('status' => 'success', 'message' => 'Transaction stored correctly'), 200);
    }

    function update($id, $state) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        TransactionRepository::update($id, $state);
    
        Flight::json(array('status' => 'success', 'message' => 'Transaction updated correctly'), 200);
    }

    function delete($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        TransactionRepository::eliminate($id);
    
        Flight::json(array('status' => 'success', 'message' => 'Transaction deleted correctly'), 200);
    }
}