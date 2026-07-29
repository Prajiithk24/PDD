# GramaVoice Backend - Run Script
# Usage: Open a terminal in the backend/ folder and run: .\run.ps1

$jar = ".\target\backend-0.0.1-SNAPSHOT.jar"
$dataPath = (Get-Location).Path + "\data\gramavoice"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  GramaVoice Backend" -ForegroundColor Cyan
Write-Host "  http://localhost:8085" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Build JAR if not present
if (-Not (Test-Path $jar)) {
    Write-Host "`nBuilding backend JAR (first time only)..." -ForegroundColor Yellow
    & .\mvnw.cmd package -DskipTests
    if (-Not (Test-Path $jar)) {
        Write-Host "ERROR: Build failed. Check errors above." -ForegroundColor Red
        exit 1
    }
    Write-Host "Build complete!" -ForegroundColor Green
}

Write-Host "`nStarting backend on port 8085...`n" -ForegroundColor Yellow

# Set environment variables and run JAR
$env:SERVER_PORT                  = "8085"
$env:GRAMAVOICE_DB_URL            = "jdbc:postgresql://aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require"
$env:GRAMAVOICE_DB_USERNAME       = "postgres.nffwpckgcrwaljmpxcef"
$env:GRAMAVOICE_DB_PASSWORD       = "Prajubhai143"
$env:APP_AUTH_SECRET              = "replace-with-a-long-random-secret"
$env:SARVAM_API_KEY               = "sk_rj6ttq4q_B6Bo503VcbvqGNC4qWaIyhUd"
$env:SARVAM_MODEL                 = "sarvam-30b"
$env:SARVAM_ENABLED               = "true"

java -jar $jar
