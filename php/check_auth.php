<?php
session_start();
header("Access-Control-Allow-Origin: ". $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Vary: Origin");

if (isset($_SESSION["user"])) {
    echo json_encode([
        "loggedIn" => true,
        "user" => $_SESSION["user"],
        "role" => $_SESSION["role"]
    ]);
} else {
    echo json_encode([
        "loggedIn" => false
    ]);
}