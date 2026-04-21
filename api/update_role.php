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
$role = $data['role'] ?? null;

if (!$id || $role === null) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE tbl_accounts 
        SET acc_role = :role 
        WHERE acc_id = :id
    ");

    $stmt->bindValue(':role', (int)$role, PDO::PARAM_INT);
    $stmt->bindValue(':id', (int)$id, PDO::PARAM_INT);

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