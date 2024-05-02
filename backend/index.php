<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
date_default_timezone_set('America/Mexico_City');

require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

Flight::register('db', mysqli::class, [$_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME'], intval($_ENV['DB_PORT'])]);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

Flight::map('error', function(Exception $e){
    if (str_starts_with($e->getMessage(), 'Duplicate') && str_ends_with($e->getMessage(), "'user.email'"))
        Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The email is already registered']));
    else if (str_starts_with($e->getMessage(), 'Duplicate') && str_ends_with($e->getMessage(), "'school.name'"))
        Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The school is already registered']));
    else
        Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
});

Flight::map('notFound', function(){
    Flight::response()->status(404);
    Flight::halt(404, json_encode(['status' => 'error', 'message' => 'The route does not exist']));
});

$user = new Services\UserService;
$school = new Services\SchoolService;
$course = new Services\CourseService;
$transaction = new Services\TransactionService;

// TEST ROUTE
Flight::route('GET /', function(){echo 'it works';});

//////////////////////
// USER ROUTES
//////////////////////
Flight::route('GET /users/@user_type', [$user, 'getAllByUserType']);
Flight::route('GET /user/@id', [$user, 'getOne']);
Flight::route('GET /user', [$user, 'getOneByToken']);
Flight::route('POST /auth', [$user, 'auth']);
Flight::route('POST /user/@user_type', [$user, 'create']);
Flight::route('POST /user-verify', [$user, 'validateVerificationCode']);
Flight::route('POST /send-reset-password-email', [$user, 'sendResetPasswordEmail']);
Flight::route('POST /reset-password', [$user, 'resetPassword']);
Flight::route('PUT /user', [$user, 'update']);
Flight::route('PUT /update-password', [$user, 'updatePassword']);
Flight::route('PUT /user/@id/@state', [$user, 'deBanUser']);
Flight::route('DELETE /user/@id', [$user, 'delete']);

//////////////////////
// SCHOOL ROUTES
//////////////////////
Flight::route('GET /schools', [$school, 'getAll']);
Flight::route('GET /school/@id', [$school, 'getOne']);
Flight::route('POST /school', [$school, 'create']);
Flight::route('PUT /school', [$school, 'update']);
Flight::route('PUT /school/@id/@state', [$school, 'deActivate']);
Flight::route('DELETE /school/@id', [$school, 'delete']);

//////////////////////
// COURSE ROUTES
//////////////////////
Flight::route('GET /courses', [$course, 'getAll']);
Flight::route('GET /courses-admin', [$course, 'getAllByAdmin']);
Flight::route('GET /course/@id', [$course, 'getOne']);
Flight::route('POST /course', [$course, 'create']);
Flight::route('POST /course-update', [$course, 'update']);
Flight::route('PUT /course/@id/@state', [$course, 'deActivate']);
Flight::route('DELETE /course/@id', [$course, 'delete']);

//////////////////////
// TRANSACTION ROUTES
//////////////////////
Flight::route('GET /transactions', [$transaction, 'getAll']);
Flight::route('GET /transactions-pending-with-image', [$transaction, 'getPendingTransactionsWithImage']);
Flight::route('GET /transactions/@state', [$transaction, 'getTransactionsByState']);
Flight::route('GET /transaction/@id', [$transaction, 'getOne']);
Flight::route('GET /transactions-customer', [$transaction, 'getAllByToken']);
Flight::route('POST /transaction', [$transaction, 'create']);
Flight::route('POST /transaction-image', [$transaction, 'uploadImage']);
Flight::route('PUT /transaction/@id/@state', [$transaction, 'update']);
Flight::route('DELETE /transaction/@id', [$transaction, 'delete']);

Flight::route('GET /course-img/@id', function($id) {
    $ruta_imagen = 'course-img/' . $id;
    if (file_exists($ruta_imagen)) {
        header('Content-Type: image/jpeg');
        readfile($ruta_imagen);
    } else {
        echo 'Image not found';
    }
});

Flight::start();