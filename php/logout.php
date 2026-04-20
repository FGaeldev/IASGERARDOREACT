<?php
session_start();
header("Access-Control-Allow-Origin: ". $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

session_destroy();

echo json_encode(["status" => "logged out"]);