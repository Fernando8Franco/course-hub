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

    function getPendingTransactions() {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getPendingTransactions();

        Flight::json($result, 200);
    }

    function getPendingTransactionsNoImage() {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getPendingTransactionsNoImage();

        Flight::json($result, 200);
    }

    function getCompletedTransactions() {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getCompletedTransactions();

        Flight::json($result, 200);
    }

    function getCanceledTransactions() {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getCanceledTransactions();

        Flight::json($result, 200);
    }

    function getOne($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $result = TransactionRepository::getOne($id);    

        Flight::json($result, 200);
    }
}