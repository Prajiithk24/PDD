$body = '{"username":"admin","password":"admin123"}'
try {
    $res = Invoke-RestMethod -Uri 'http://localhost:8085/api/auth/login' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "ADMIN LOGIN SUCCESS:" ($res.user | ConvertTo-Json)
} catch {
    Write-Host "ADMIN LOGIN ERROR:" $_.Exception.Message
}
