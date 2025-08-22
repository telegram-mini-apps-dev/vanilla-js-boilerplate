<?php
// Check if the request is a POST request and the 'initData' parameter is set
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['initData'])) {

    // Telegram bot token and database connection details
    $botToken = 'real telegram bot token'; // The bot token provided by Telegram
    $hostname = 'host name';               // Hostname of the MySQL server
    $database = 'database name';           // Database name
    $username = 'database user';           // MySQL username
    $password = 'database password';       // MySQL password

    // PDO options for MySQL connection
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,            // Enable exception handling for errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch results as associative arrays
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci" // Set character encoding
    ];

    try {
        // Create a new PDO connection to the MySQL database
        $pdo = new PDO("mysql:host=$hostname;dbname=$database", $username, $password, $options);
    } catch (PDOException $e) {
        // Return a JSON response with a failure message if the database connection fails
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }

    // Retrieve and process 'initData' sent via POST
    $initData = $_POST['initData'];
    parse_str($initData, $params); // Parse the 'initData' string into an associative array
    $hash = $params['hash']; // Extract the hash from the parameters
    unset($params['hash']);  // Remove the hash from the parameters for further processing

    // Sort parameters alphabetically and create a data string for verification
    ksort($params); 
    $dataCheckString = urldecode(http_build_query($params)); // Generate a string for hash comparison

    // Generate a HMAC signature using the bot token and WebAppData as the key
    $secretKey = hash_hmac('sha256', $botToken, 'WebAppData', true); // Generate the secret key
    $hmac = hash_hmac('sha256', $dataCheckString, $secretKey);       // Create a hash of the data string

    $response = []; // Initialize an empty array for the response

    // Verify that the generated HMAC matches the hash provided by the client
    if (hash_equals($hmac, $hash)) {
        $authDate = (int)$params['auth_date']; // Extract the 'auth_date' parameter
        if (time() - $authDate < 3600) {       // Check if the auth date is within the last hour
            $user = json_decode($params['user'], true); // Parse the 'user' parameter as a JSON object
            $userId = $user['id'];                     // Get the user ID from the parsed user object

            try {
                // Query the database to check if the user exists based on their Telegram chat ID
                $stmt = $pdo->prepare('SELECT count(*) FROM `users` WHERE telegramChatId = ?');
                $stmt->execute([$userId]); // Execute the query with the user ID
                $numberOfUsers = $stmt->fetchColumn(); // Get the number of users found with this ID
            } catch (PDOException $e) {
                // Return a JSON response with a failure message if there's a database error
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
                exit;
            }

            // If the user exists in the database, return a success response
            if ($numberOfUsers > 0) {
                $response = ['success' => true];
            } else {
                // If the user is not found, return a failure message
                $response = ['success' => false, 'message' => 'User not found'];
            }
        } else {
            // If the authentication date is too old, return a failure message
            $response = ['success' => false, 'message' => 'Data is outdated'];
        }
    } else {
        // If the HMAC verification fails, return a failure message
        $response = ['success' => false, 'message' => 'Data is invalid'];
    }

    // Set the response content type to JSON and return the response
    header('Content-Type: application/json');
    echo json_encode($response);
    exit; // Terminate the script after sending the response
}
?>