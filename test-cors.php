<?php

/**
 * Test CORS pentru API
 * Accesează acest fișier pentru a testa configurația CORS
 */

// Headers pentru CORS și JSON
header('Content-Type: application/json; charset=utf-8');

// CORS headers pentru multiple domenii
$allowedOrigins = [
    'http://localhost:3000',
    'http://localhost',
    'https://casare-rable.ro',
    'https://bibic.ro'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';

// Log pentru debugging CORS
error_log("CORS Test - Origin: " . $origin . ", Host: " . $host);

// Verifică dacă origin-ul este în lista de domenii permise
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    $corsStatus = "PERMIS";
} else {
    // Fallback pentru localhost fără port
    if (strpos($origin, 'http://localhost') === 0) {
        header('Access-Control-Allow-Origin: ' . $origin);
        $corsStatus = "PERMIS (fallback localhost)";
    } else {
        $corsStatus = "BLOCAT";
    }
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, Origin');
header('Access-Control-Allow-Credentials: true');

// Răspunde la preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Returnează informații despre CORS
echo json_encode([
    'status' => 'success',
    'cors_status' => $corsStatus,
    'origin' => $origin,
    'host' => $host,
    'allowed_origins' => $allowedOrigins,
    'timestamp' => date('Y-m-d H:i:s'),
    'message' => 'Test CORS completat'
], JSON_PRETTY_PRINT);
