<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['initData'])) {
    $botToken = 'real telegram bot token';
    $hostname = 'host name';
    $database = 'database name';
    $username = 'database user';
    $password = 'database password';

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ];

    try {
        $pdo = new PDO("mysql:host=$hostname;dbname=$database", $username, $password, $options);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }

    $initData = $_POST['initData'];
    parse_str($initData, $params);
    $hash = $params['hash'];
    unset($params['hash']);

    ksort($params);
    $dataCheckString = '';
    foreach ($params as $key => $value) {
        $dataCheckString .= $key . '=' . $value . "\n";
    }
    $dataCheckString = rtrim($dataCheckString, "\n");

    $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true);
    $hmac = hash_hmac('sha256', $dataCheckString, $secretKey);

    $response = [];
    if (hash_equals($hmac, $hash)) {
        $authDate = (int)$params['auth_date'];
        $currentTime = time();

        if ($currentTime - $authDate < 3600) {
            $user = json_decode($params['user'], true);
            $userId = $user['id'];

            try {
                $stmt = $pdo->prepare('SELECT count(*) FROM `users` WHERE telegramChatId = ?');
                $stmt->execute([$userId]);
                $number_of_users = $stmt->fetchColumn();

                $pdo = null;
            } catch (PDOException $e) {
                $response = ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
                header('Content-Type: application/json');
                echo json_encode($response);
                exit;
            }

            if ($number_of_users > 0) {
                $response = ['success' => true];
            } else {
                $response = ['success' => false, 'message' => 'User not found'];
            }
        } else {
            $response = ['success' => false, 'message' => 'Data is outdated'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Data is invalid'];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}
?>
