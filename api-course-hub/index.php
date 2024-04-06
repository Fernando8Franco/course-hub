<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require 'vendor/autoload.php';
require 'services/UserService.php';

Flight::register('db', mysqli::class, ['course-hub-mysql-1', 'root', 'Fernand0101', 'CourseHubDB']);

$user = new UserService();

//USER ROUTES
Flight::route('GET /users', [$user, 'getAll']);
Flight::route('GET /user/@id', [$user, 'getOne']);
Flight::route('POST /auth', [$user, 'auth']);
Flight::route('POST /users', [$user, 'create']);
Flight::route('PUT /user/@id', [$user, 'update']);
Flight::route('DELETE /user/@id', [$user, 'delete']);

Flight::start();