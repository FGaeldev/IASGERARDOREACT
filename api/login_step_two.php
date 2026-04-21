<?php
error_reporting(E_ERROR);
session_start();

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['answer']; 
$status = 1; //account active

try {
    //check if user exist
    $stmt = $pdo->prepare(
        "SELECT acc_id, acc_answer, acc_role 
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
        if (password_verify($password, $users[0]["acc_answer"])) {
            //init session data
            $_SESSION["user"] = $email;
            $_SESSION["role"] = $users[0]['acc_role'];

            echo json_encode([
                "success" => true,
                "role"    => $_SESSION["role"],
                "message" => "logged in"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Incorrect Password"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect Username"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error"
    ]);
}