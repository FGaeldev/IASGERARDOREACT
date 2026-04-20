<?php
header("Access-Control-Allow-Origin: ". $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "db.php"; // must provide $pdo (PDO instance)

// READ JSON INPUT
$data = json_decode(file_get_contents("php://input"), true);

$id   = $data['id'] ?? null;
$email = $data['email'] ?? null;

try {
    $stmt = $pdo->prepare("
        UPDATE tbl_accounts
        SET acc_status = :deleted 
        WHERE acc_id = :id AND acc_email = :email
    ");

    $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);
    $stmt->bindValue(':deleted', (int)0/*0-Deleted Status*/, PDO::PARAM_INT);
    $stmt->bindValue(':email', (String)$email, PDO::PARAM_STR);


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