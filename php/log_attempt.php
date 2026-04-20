<?php
error_reporting(E_ERROR);
session_start();

header("Access-Control-Allow-Origin: ". $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];

try {
    $stmt = $pdo->prepare(
        "INSERT INTO tbl_attempts(log_email) 
            VALUES (:email)"
    );

    $stmt->bindValue(':email', $email, PDO::PARAM_STR);

    $stmt->execute();

    echo json_encode([
        "success" => true,
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
    ]);
}