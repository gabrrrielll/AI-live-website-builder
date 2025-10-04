# Test 1: Simulate attack from production origin with test-nonce (should FAIL)
Write-Host "`n=== TEST 1: Attack from production origin with test-nonce (should FAIL) ===" -ForegroundColor Yellow

$headers = @{
    "X-WP-Nonce" = "test-nonce-12345"
    "Content-Type" = "application/json"
    "Origin" = "https://production-site.com"
}

$body = @{
    config = @{}
    domain = "test.ai-web.site"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "https://ai-web.site/wp-json/ai-web-site/v1/website-config" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Red
    Write-Host "FAIL: Attack succeeded! Security breach!" -ForegroundColor Red
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Green
    Write-Host "SUCCESS: Attack blocked! ✅" -ForegroundColor Green
}

# Test 2: Legitimate request from localhost (should SUCCEED)
Write-Host "`n=== TEST 2: Legitimate request from localhost (should SUCCEED) ===" -ForegroundColor Yellow

$headers2 = @{
    "X-WP-Nonce" = "test-nonce-12345"
    "Content-Type" = "application/json"
    "Origin" = "http://localhost:3000"
}

try {
    $response2 = Invoke-WebRequest -Uri "https://ai-web.site/wp-json/ai-web-site/v1/website-config" `
        -Method POST `
        -Headers $headers2 `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "Status: $($response2.StatusCode)" -ForegroundColor Green
    Write-Host "SUCCESS: Localhost request allowed! ✅" -ForegroundColor Green
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "FAIL: Localhost request blocked!" -ForegroundColor Red
}

Write-Host "`n=== Security Tests Complete ===" -ForegroundColor Cyan

