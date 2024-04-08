<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

Flight::register('db', mysqli::class, [$_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']]);

$user = new Services\UserService;

//USER ROUTES
Flight::route('GET /users', [$user, 'getAll']);
Flight::route('GET /user', [$user, 'getUserData']);
Flight::route('GET /user/@id', [$user, 'getOne']);
Flight::route('POST /users', [$user, 'create']);
Flight::route('POST /auth', [$user, 'auth']);
Flight::route('POST /send-reset-password-email', [$user, 'sendResetPasswordEmail']);
Flight::route('POST /reset-password/', [$user, 'updatePasswordByToken']);
Flight::route('PUT /user/@id', [$user, 'update']);
Flight::route('PUT /update-password/@id', [$user, 'updatePassword']);
Flight::route('DELETE /user/@id', [$user, 'delete']);

Flight::start();