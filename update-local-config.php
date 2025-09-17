<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Get the raw POST data
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data || !isset($data['config'])) {
        throw new Exception('Invalid request data - config is required');
    }

    $config = $data['config'];

    // Validate that config is an array/object
    if (!is_array($config)) {
        throw new Exception('Config must be a valid JSON object');
    }

    // Convert config to pretty JSON
    $jsonData = json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

    if ($jsonData === false) {
        throw new Exception('Failed to encode config as JSON');
    }

    // Path to the public site-config.json file
    $configPath = __DIR__ . '/public/site-config.json';

    // Ensure the public directory exists
    $publicDir = dirname($configPath);
    if (!is_dir($publicDir)) {
        if (!mkdir($publicDir, 0755, true)) {
            throw new Exception('Failed to create public directory');
        }
    }

    // Write the configuration to the file
    $bytesWritten = file_put_contents($configPath, $jsonData, LOCK_EX);

    if ($bytesWritten === false) {
        throw new Exception('Failed to write configuration file');
    }

    // Log the update
    error_log("Local site-config.json updated successfully. Bytes written: $bytesWritten");

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Configuration updated successfully',
        'bytes_written' => $bytesWritten,
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    error_log("Error updating local site-config.json: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
