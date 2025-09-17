# Backend Setup Guide

This application now uses a secure backend service to handle all external API calls. This ensures that API keys are never exposed to the frontend.

## Files Created

### 1. `constants.php`
Contains all API keys and configuration:
- `GEMINI_API_KEY` - For AI text generation
- `UNSPLASH_API_KEY` - For image search
- `EMAILJS_*` - For email functionality

### 2. `ai-service.php`
Main backend endpoint that handles:
- Text generation with Gemini
- Image search with Unsplash
- Email sending with EmailJS

## Setup Instructions

### 1. Upload Files to Server
Upload both `constants.php` and `ai-service.php` to your web server.

### 2. Configure API Keys
Edit `constants.php` and replace the placeholder values with your actual API keys:

```php
// AI Services
define('GEMINI_API_KEY', 'your_actual_gemini_api_key');
define('UNSPLASH_API_KEY', 'your_actual_unsplash_api_key');

// EmailJS Configuration  
define('EMAILJS_SERVICE_ID', 'your_actual_service_id');
define('EMAILJS_TEMPLATE_ID', 'your_actual_template_id');
define('EMAILJS_PUBLIC_KEY', 'your_actual_public_key');
```

### 3. Update CORS Settings
In `constants.php`, update the `ALLOWED_ORIGINS` array with your domain:

```php
define('ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:5173', 
    'https://yourdomain.com'  // Add your production domain
]);
```

### 4. Security Considerations

#### File Permissions
- Set `constants.php` to be readable only by the web server
- Consider moving `constants.php` outside the web root if possible

#### .gitignore
Add to your `.gitignore`:
```
constants.php
```

#### Environment Variables (Alternative)
For better security, you can use environment variables instead of hardcoded values:

```php
define('GEMINI_API_KEY', $_ENV['GEMINI_API_KEY'] ?? 'fallback_key');
```

## API Endpoints

The `ai-service.php` accepts POST requests with the following actions:

### Generate Text
```json
{
  "action": "generate_text",
  "prompt": "Your prompt here",
  "format": "text|json",
  "maxRetries": 3
}
```

### Search Images
```json
{
  "action": "search_images", 
  "query": "search term",
  "per_page": 30
}
```

### Send Email
```json
{
  "action": "send_email",
  "template_data": {
    "from_name": "John Doe",
    "reply_to": "john@example.com",
    "phone": "123-456-7890",
    "message": "Hello world"
  },
  "recipient_email": "admin@example.com"
}
```

## Testing

Test the backend service by making a POST request:

```bash
curl -X POST https://yourdomain.com/ai-service.php \
  -H "Content-Type: application/json" \
  -d '{"action": "generate_text", "prompt": "Hello", "format": "text"}'
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your domain is in `ALLOWED_ORIGINS`
2. **API Key Errors**: Verify all keys are correctly set in `constants.php`
3. **File Permissions**: Ensure the web server can read both PHP files
4. **PHP Extensions**: Make sure `curl` extension is enabled

### Debug Mode
Add this to the top of `ai-service.php` for debugging:

```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## Migration Notes

- Frontend no longer needs API keys in `.env`
- All AI functionality now goes through the backend
- Rate limiting and caching can be implemented in the backend
- Usage logging can be added to monitor API consumption
