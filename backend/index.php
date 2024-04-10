<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

Flight::register('db', mysqli::class, [$_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME'], intval($_ENV['DB_PORT'])]);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$user = new Services\UserService;
$school = new Services\SchoolService;
$course = new Services\CourseService;
$transaction = new Services\TransactionService;

// TEST ROUTE
Flight::route('GET /', function(){echo 'it works';});

// USER ROUTES
Flight::route('GET /users', [$user, 'getAll']);
Flight::route('GET /user/@id', [$user, 'getOne']);
Flight::route('GET /user', [$user, 'getOneByToken']);

Flight::route('POST /auth', [$user, 'auth']);
Flight::route('POST /user-admin', [$user, 'createAdmin']);
Flight::route('POST /user-customer', [$user, 'createCustomer']);
Flight::route('POST /send-reset-password-email', [$user, 'sendResetPasswordEmail']);
Flight::route('POST /reset-password', [$user, 'resetPassword']);

Flight::route('PUT /user-admin', [$user, 'update']);
Flight::route('PUT /user-customer', [$user, 'updateCustomer']);
Flight::route('PUT /update-password', [$user, 'updatePassword']);

Flight::route('DELETE /user/@id', [$user, 'delete']);

// SCHOOL ROUTES
Flight::route('GET /schools', [$school, 'getAll']);
Flight::route('GET /school/@id', [$school, 'getOne']);

Flight::route('POST /school', [$school, 'create']);

Flight::route('PUT /school', [$school, 'update']);

Flight::route('DELETE /school/@id', [$school, 'delete']);

// COURSE ROUTES
Flight::route('GET /courses', [$course, 'getAll']);
Flight::route('GET /course/@id', [$course, 'getOne']);

Flight::route('POST /course', [$course, 'create']);

Flight::route('PUT /course', [$course, 'update']);

Flight::route('DELETE /course/@id', [$course, 'delete']);

// TRANSACTION ROUTES
Flight::route('GET /transactions', [$transaction, 'getAll']);
Flight::route('GET /transactions-pending', [$transaction, 'getPendingTransactions']);
Flight::route('GET /transactions-pending-no-image', [$transaction, 'getPendingTransactionsNoImage']);
Flight::route('GET /transactions-completed', [$transaction, 'getCompletedTransactions']);
Flight::route('GET /transactions-canceled', [$transaction, 'getCanceledTransactions']);
Flight::route('GET /transaction/@id', [$transaction, 'getOne']);

Flight::start();