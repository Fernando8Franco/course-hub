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
            Haga click <a href="{$_ENV['HOST_FRONT']}/reset-password/{$token}">aquí</a> para cambiar su contraseña.
        </body>
        </html>
        END;
    }
}