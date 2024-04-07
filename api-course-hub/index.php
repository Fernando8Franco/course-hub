<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'vendor/autoload.php';
require 'services/UserService.php';

Flight::register('db', mysqli::class, ['course-hub-mysql-1', 'root', 'Fernand0101', 'CourseHubDB']);

$user = new UserService();

//USER ROUTES
Flight::route('GET /users', [$user, 'getAll']);
Flight::route('GET /user', [$user, 'getUserData']);
Flight::route('GET /user/@id', [$user, 'getOne']);
Flight::route('POST /users', [$user, 'create']);
Flight::route('POST /auth', [$user, 'auth']);
Flight::route('POST /send-reset-password-email', [$user, 'sendResetPasswordEmail']);
Flight::route('PUT /user/@id', [$user, 'update']);
Flight::route('PUT /update-password/@id', [$user, 'updatePassword']);
Flight::route('PUT /reset-password', [$user, 'updatePasswordByToken']);
Flight::route('DELETE /user/@id', [$user, 'delete']);

Flight::start();