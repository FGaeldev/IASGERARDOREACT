<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: ". $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once "db.php"; // must return $pdo (PDO instance)

// READ JSON INPUT
$data = json_decode(file_get_contents("php://input"), true);

$page = isset($data['page']) ? (int) $data['page'] : 1;
$limit = 6;
$status = 1;

$offset = ($page - 1) * $limit;

try {

    // =====================
    // GET USERS
    // =====================
    $stmt = $pdo->prepare("
    SELECT acc_id, acc_email, acc_role 
    FROM tbl_accounts 
    WHERE acc_status = :status 
    ORDER BY acc_role DESC, acc_email ASC
    LIMIT :limit OFFSET :offset
    ");

    $stmt->bindValue(':status', $status, PDO::PARAM_INT);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // =====================
    // COUNT TOTAL
    // =====================
    $countStmt = $pdo->prepare("
        SELECT COUNT(*) as total 
        FROM tbl_accounts 
        WHERE acc_status = :status
    ");

    $countStmt->bindValue(':status', $status, PDO::PARAM_INT);
    $countStmt->execute();

    $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // =====================
    // RESPONSE
    // =====================
    echo json_encode([
        "users" => $users,
        "totalPages" => ceil($total / $limit)
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}