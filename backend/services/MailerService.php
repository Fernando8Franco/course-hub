<?php

namespace Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use flight;

class MailerService {
    public static function sendEmail($email, $body) {
        try {
            $mail = new PHPMailer(true);

            //$mail->SMTPDebug = SMTP::DEBUG_SERVER;

            $mail->isSMTP();
            $mail->SMTPAuth = true;
        
            $mail->Host = $_ENV['MAILER_HOST'];
            $mail->Port = $_ENV['MAILER_PORT'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Username = $_ENV['MAILER_ADDRESS'];
            $mail->Password = $_ENV['MAILER_PASSWORD'];

            $mail->setFrom('no-reply@gmail.com');
            $mail->addAddress($email);
            $mail->Subject = 'Cambio de contraseña';
            $mail->CharSet = 'UTF-8';
        
            $mail->isHTML(true);

            $mail->Body = $body;
        
            $mail->send();
        } catch (Exception $e) {
            Flight::halt(400, json_encode(['status' => 'error', 'message' => $e->getMessage()]));
        }
    }
}