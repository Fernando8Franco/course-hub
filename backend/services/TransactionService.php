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

        Flight::halt(200, json_encode($result));
    }

    function getPendingTransactionsWithImage() {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getPendingTransactionsWithImage();

        Flight::halt(200, json_encode($result));
    }

    function getTransactionsByState($state) {
        $token_data = tokenData();
        
        validateAdmin($token_data->user_type);

        $result = TransactionRepository::getTransactionsByState($state);

        Flight::halt(200, json_encode($result));
    }

    function getOne($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);
        
        $result = TransactionRepository::getOne($id);    

        Flight::halt(200, json_encode($result));
    }

    function getAllByToken() {
        $token_data = tokenData();

        validateCustomer($token_data->user_type);

        $result = TransactionRepository::getAllByToken($token_data->user_id);

        Flight::halt(200, json_encode($result));
    }

    function create() {
        $token_data = tokenData();

        validateCustomer($token_data->user_type);

        try {
            $data = Flight::request()->data;
            $course_id = $data->course_id;

            if (is_null($course_id))
                throw new Exception('The field course_id can not be empty');
            if (!ctype_digit((string)$course_id))
                throw new Exception('Not valid course id');

        } catch (Exception $e) {
            Flight::error($e);
        }

        if (!TransactionRepository::courseIsActive($data->course_id))
            Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The course is not available']));

        $week_transactions = TransactionRepository::countWeekTransactions($token_data->user_id);

        if ($week_transactions >= 7)
            Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'Transaction limit has been reached']));

        TransactionRepository::save($token_data->user_id, $course_id);

        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Transaction stored correctly']));
    }

    function uploadImage() {
        $token_data = tokenData();

        validateCustomer($token_data->user_type);

        try {
            $transaction_id = Flight::request()->data->transaction_id;
            $image = Flight::request()->files->image;

            if (is_null($transaction_id))
                throw new Exception('The field transaction_id can not be empty');
            $this->validateImage( $image);
        } catch (Exception $e) {
            Flight::error($e);
        }

        TransactionRepository::uploadImage($transaction_id, $image, $token_data->user_id);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Transaction image updated correctly']));
    }

    function update($id, $state) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        TransactionRepository::update($id, $state);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => $state]));
    }

    function delete($id) {
        $token_data = tokenData();

        validateAdmin($token_data->user_type);

        TransactionRepository::eliminate($id);
    
        Flight::halt(200, json_encode(['status' => 'success', 'message' => 'Transaction deleted correctly']));
    }

    private function validateImage($image) {
        if (empty($image))
            throw new Exception('The field image can not be empty');

        if ($image['size'] > 300000)
            throw new Exception('Image to large');

        $fileType = strtolower(pathinfo($image['full_path'],PATHINFO_EXTENSION));
        if ($fileType != "jpg" && $fileType != "png" && $fileType != "jpeg")
            throw new Exception('File type not accepted only JPG, JPEG or PNG');

        return $fileType;
    }
}