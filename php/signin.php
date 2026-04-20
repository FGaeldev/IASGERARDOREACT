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
$password = $data["password"];
$status = 1;


try {
    //check if user exist
    $stmt = $pdo->prepare(
        "SELECT acc_id, acc_role 
        FROM tbl_accounts 
        WHERE acc_status = :status
        AND acc_email = :email"
    );

    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->bindValue(':status', $status, PDO::PARAM_INT);

    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //check if email is in db
    if ($users) {
        //check password
        echo json_encode([
            "success" => false,
            "message" => "Email In Use"
        ]);
    } else {
        $stmt = $pdo->prepare(
            "INSERT INTO tbl_accounts(acc_email, acc_hashedpass, acc_question, acc_answer) 
            VALUES (:email, :hashedpass, :question, :answer)"
        );

        $stmt->bindValue(':email', $email, PDO::PARAM_STR);
        $stmt->bindValue(':hashedpass', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
        $stmt->bindValue(':answer', password_hash("answer", PASSWORD_DEFAULT), PDO::PARAM_STR);
        $stmt->bindValue(':question', "(default answer: answer)", PDO::PARAM_STR);

        $stmt->execute();

        echo json_encode([
            "success" => true,
            "message" => "Account Created"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}