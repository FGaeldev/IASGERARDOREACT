<?php
error_reporting(E_ERROR);
session_start();

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db.php"; // must provide $pdo (PDO instance)

// READ JSON INPUT
$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $pdo->prepare(
        "UPDATE tbl_accounts 
        SET acc_question = :question, acc_answer = :answer 
        WHERE acc_email = :email"
    );

    $stmt->bindValue(':question', (String)$data['question'], PDO::PARAM_STR);
    $stmt->bindValue(':answer', password_hash($data['answer'], PASSWORD_DEFAULT), PDO::PARAM_STR);
    $stmt->bindValue(':email', $_SESSION['user'], PDO::PARAM_STR);

    $stmt->execute();
    echo json_encode([
        "success" => true
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
