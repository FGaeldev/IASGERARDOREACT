<?php
error_reporting(E_ERROR);
session_start();

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db.php"; // must provide $pdo (PDO instance)
$data = json_decode(file_get_contents("php://input"), true);

$user = $_SESSION['user'] ?? $data;

try {
    $stmt = $pdo->prepare(
        "SELECT acc_question, acc_answer FROM tbl_accounts 
        WHERE acc_email = :email"
    );

    $stmt->bindValue(':email', $user, PDO::PARAM_STR);

    $stmt->execute();
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode([
        "success" => true,
        "user" => $user,
        "question" => $res['acc_question'],
        "answer" => $res['acc_answer']
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}