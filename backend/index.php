<?php

require 'vendor/autoload.php';

Flight::route('/', function () {
  echo '¡Hola Mundo!';
});

Flight::start();