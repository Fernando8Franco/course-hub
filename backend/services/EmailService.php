<?php

namespace Services;

class EmailService {
    public static function tokenEmail($token) {
        return <<<END
        <html>
        <head>
            <style>
                /* Estilos para el cuerpo del correo */
                body {
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            Haga click <a href="{$_ENV['HOST_FRONT']}{$token}">aquí</a> para cambiar su contraseña.
        </body>
        </html>
        END;
    }

    public static function verifyEmail($verification_code) {
        return <<<END
        <html>
        <head>
            <style>
                /* Estilos para el cuerpo del correo */
                body {
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            Su codigo de verificación es: {$verification_code}
        </body>
        </html>
        END;
    }
}