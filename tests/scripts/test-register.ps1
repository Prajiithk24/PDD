$randomNum = Get-Random -Minimum 10000 -Maximum 99999
$bodyJson = @"
{
    "username": "user$randomNum",
    "password": "praveen123",
    "fullName": "Gautham User",
    "mobileNumber": "98765$randomNum",
    "village": "Chennai",
    "district": "Chennai"
}
"@

Write-Host "Registering with body: $bodyJson"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8085/api/auth/register" -Method POST -ContentType "application/json; charset=utf-8" -Body $bodyJson
    Write-Host "SUCCESS:" ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Host "ERROR STATUS:" $_.Exception.Response.StatusCode.value__
    try {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "ERROR BODY:" $errorBody
    } catch {
        Write-Host "Could not read error body: $_"
    }
}
