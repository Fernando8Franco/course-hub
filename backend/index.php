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

// TEST ROUTE
Flight::route('GET /', function(){echo 'it works';});

// USER ROUTES
Flight::route('GET /users', [$user, 'getAll']);
Flight::route('GET /user/@id', [$user, 'getOne']);
Flight::route('GET /user', [$user, 'getOneByToken']);

Flight::route('POST /auth', [$user, 'auth']);
Flight::route('POST /user-admin', [$user, 'createAdmin']);
Flight::route('POST /user-costumer', [$user, 'createCostumer']);
Flight::route('POST /send-reset-password-email', [$user, 'sendResetPasswordEmail']);
Flight::route('POST /reset-password', [$user, 'resetPassword']);

Flight::route('PUT /user-admin/@id', [$user, 'update']);
Flight::route('PUT /user-costumer', [$user, 'updateCostumer']);
Flight::route('PUT /update-password', [$user, 'updatePassword']);

Flight::route('DELETE /user/@id', [$user, 'delete']);

// SCHOOL ROUTES
Flight::route('GET /schools', [$school, 'getAll']);
Flight::route('GET /school/@id', [$school, 'getOne']);

Flight::route('POST /school', [$school, 'create']);

Flight::route('PUT /school', [$school, 'update']);

Flight::route('DELETE /school/@id', [$school, 'delete']);

Flight::start();