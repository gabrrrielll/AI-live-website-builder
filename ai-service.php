<?php
/**
 * AI Service Backend
 * 
 * Handles AI operations securely on the server side:
 * - Text generation with Gemini
 * - Image search with Unsplash  
 * - Email sending with EmailJS
 * 
 * All API keys are kept secure on the server.
 */

// Include constants
require_once 'constants.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . implode(', ', ALLOWED_ORIGINS));
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing action parameter']);
    exit();
}

$action = $input['action'];

try {
    switch ($action) {
        case 'generate_text':
            $result = generateText($input);
            break;
            
        case 'search_images':
            $result = searchImages($input);
            break;
            
        case 'send_email':
            $result = sendEmail($input);
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            exit();
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}

/**
 * Generate text using Gemini API
 */
function generateText($input) {
    if (!isset($input['prompt']) || !isset($input['format'])) {
        throw new Exception('Missing prompt or format parameter');
    }
    
    $prompt = $input['prompt'];
    $format = $input['format']; // 'text' or 'json'
    $maxRetries = $input['maxRetries'] ?? MAX_RETRIES;
    
    // Prepare the prompt for JSON format
    if ($format === 'json') {
        $prompt = $prompt . "\n\nIMPORTANT: Return ONLY valid JSON. Do not include any text before or after the JSON. Do not use markdown formatting like ```json`. The response must start with { and end with }.";
    }
    
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . GEMINI_API_KEY;
    
    $data = [
        'contents' => [
            [
                'parts' => [
                    ['text' => $prompt]
                ]
            ]
        ]
    ];
    
    for ($attempt = 1; $attempt <= $maxRetries; $attempt++) {
        $response = makeHttpRequest($url, 'POST', json_encode($data));
        
        if ($response['success']) {
            $responseData = json_decode($response['body'], true);
            
            if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
                $text = $responseData['candidates'][0]['content']['parts'][0]['text'];
                
                // Clean up JSON response if needed
                if ($format === 'json') {
                    $text = trim($text);
                    // Remove markdown formatting if present
                    $text = preg_replace('/^```json\s*/', '', $text);
                    $text = preg_replace('/\s*```$/', '', $text);
                    
                    // Validate JSON
                    json_decode($text);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        if ($attempt < $maxRetries) {
                            continue; // Retry
                        }
                        throw new Exception('Invalid JSON response from AI');
                    }
                }
                
                return [
                    'success' => true,
                    'text' => $text,
                    'attempts' => $attempt
                ];
            }
        }
        
        // If we get here, there was an error
        if ($attempt === $maxRetries) {
            throw new Exception('Failed to generate text after ' . $maxRetries . ' attempts');
        }
        
        // Wait before retry
        sleep(1);
    }
}

/**
 * Search images using Unsplash API
 */
function searchImages($input) {
    if (!isset($input['query'])) {
        throw new Exception('Missing query parameter');
    }
    
    $query = urlencode($input['query']);
    $perPage = $input['per_page'] ?? 12;
    
    $url = "https://api.unsplash.com/search/photos?query={$query}&per_page={$perPage}";
    
    $headers = [
        'Authorization: Client-ID ' . UNSPLASH_API_KEY
    ];
    
    $response = makeHttpRequest($url, 'GET', null, $headers);
    
    if (!$response['success']) {
        throw new Exception('Failed to search images: ' . $response['error']);
    }
    
    $data = json_decode($response['body'], true);
    
    if (!$data || !isset($data['results'])) {
        throw new Exception('Invalid response from Unsplash API');
    }
    
    // Format the response to match frontend expectations
    $photos = [];
    foreach ($data['results'] as $photo) {
        $photos[] = [
            'id' => $photo['id'],
            'urls' => [
                'full' => $photo['urls']['full'],
                'regular' => $photo['urls']['regular'],
                'small' => $photo['urls']['small']
            ],
            'alt_description' => $photo['alt_description'] ?? '',
            'description' => $photo['description'] ?? ''
        ];
    }
    
    return [
        'success' => true,
        'photos' => $photos
    ];
}

/**
 * Send email using EmailJS
 */
function sendEmail($input) {
    if (!isset($input['template_data']) || !isset($input['recipient_email'])) {
        throw new Exception('Missing template_data or recipient_email parameter');
    }
    
    $templateData = $input['template_data'];
    $recipientEmail = $input['recipient_email'];
    
    // Prepare the data for EmailJS
    $emailData = [
        'service_id' => EMAILJS_SERVICE_ID,
        'template_id' => EMAILJS_TEMPLATE_ID,
        'user_id' => EMAILJS_PUBLIC_KEY,
        'template_params' => array_merge($templateData, [
            'to_email' => $recipientEmail
        ])
    ];
    
    $url = 'https://api.emailjs.com/api/v1.0/email/send';
    
    $response = makeHttpRequest($url, 'POST', json_encode($emailData), [
        'Content-Type: application/json'
    ]);
    
    if (!$response['success']) {
        throw new Exception('Failed to send email: ' . $response['error']);
    }
    
    return [
        'success' => true,
        'message' => 'Email sent successfully'
    ];
}

/**
 * Make HTTP request with error handling
 */
function makeHttpRequest($url, $method = 'GET', $data = null, $headers = []) {
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => TIMEOUT_SECONDS,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_FOLLOWLOCATION => true
    ]);
    
    if ($data && in_array($method, ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        if (!in_array('Content-Type: application/json', $headers)) {
            $headers[] = 'Content-Type: application/json';
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    if ($error) {
        return [
            'success' => false,
            'error' => $error
        ];
    }
    
    if ($httpCode >= 400) {
        return [
            'success' => false,
            'error' => 'HTTP ' . $httpCode,
            'body' => $response
        ];
    }
    
    return [
        'success' => true,
        'body' => $response,
        'http_code' => $httpCode
    ];
}
?>
