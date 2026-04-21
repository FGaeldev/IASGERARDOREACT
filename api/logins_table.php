<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: ". $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once "db.php"; // must return $pdo (PDO instance)

$data = json_decode(file_get_contents("php://input"), true);

$page = isset($data['currentPage']) ? (int)$data['currentPage'] : 1;
$limit = 8;
$offset = ($page - 1) * $limit;


$stmt = $pdo->prepare(
    "SELECT log_id, log_email, log_datetime 
     FROM tbl_attempts
     ORDER BY log_datetime DESC
     LIMIT :limit OFFSET :offset"
);

$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

$stmt->execute();
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

$countStmt = $pdo->query("SELECT COUNT(*) as total FROM tbl_attempts");
$total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

echo json_encode([
    "logs" => $logs,
    "totalPages" => ceil($total / $limit)
]);