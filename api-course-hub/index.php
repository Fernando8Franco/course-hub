<?php

require 'vendor/autoload.php';

Flight::route('/', function () {
  $array = [
    "text" => "holi",
    "status" => "success"
  ];
  echo json_encode($array);
});

Flight::route('/home', function () {
  echo 'Hola';
});

Flight::start();