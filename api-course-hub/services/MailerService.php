<?php

namespace Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use flight;

$mail = new PHPMailer(true);

try {
    //$mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->SMTPAuth = true;

    $mail->Host = $_ENV['MAILER_HOST'];
    $mail->Port = $_ENV['MAILER_PORT'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Username = $_ENV['MAILER_ADDRESS'];
    $mail->Password = $_ENV['MAILER_PASSWORD'];

    $mail->isHTML(true);

    return $mail;
} catch (Exception $e) {
    Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
}