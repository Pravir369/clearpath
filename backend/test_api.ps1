# Remove existing database to test auto-seeding
Remove-Item -Path "C:\Users\pravir\clearpath\backend\clearpath.db" -Force -ErrorAction SilentlyContinue
Write-Host "Database cleaned for fresh seed test"

# Start uvicorn server in background
Write-Host "Starting uvicorn server on port 8000..."
$proc = Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m", "uvicorn", "main:app", "--port", "8000" -PassThru -WorkingDirectory "C:\Users\pravir\clearpath\backend"
Write-Host "Server process started (PID: $($proc.Id))"

# Wait for server to start
Start-Sleep -Seconds 5

try {
    Write-Host "`n=== SMOKE TEST RESULTS ===" -ForegroundColor Cyan

    # Test 1: Health endpoint
    Write-Host "`n[1/5] Testing GET /health..."
    try {
        $health = Invoke-RestMethod "http://localhost:8000/health" -ErrorAction Stop
        Write-Host "✓ Status: $($health.status)" -ForegroundColor Green
    } catch {
        Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        throw $_
    }

    # Test 2: List clients
    Write-Host "`n[2/5] Testing GET /api/clients..."
    try {
        $clients = Invoke-RestMethod "http://localhost:8000/api/clients" -ErrorAction Stop
        Write-Host "✓ Retrieved $($clients.Length) clients" -ForegroundColor Green

        if ($clients.Length -eq 0) {
            Write-Host "⚠ Warning: No clients returned (expected 5)" -ForegroundColor Yellow
        } else {
            Write-Host "  Client names:" -ForegroundColor Gray
            foreach ($c in $clients) {
                Write-Host "    - $($c.name) (released $(([datetime]$c.release_date).ToString('yyyy-MM-dd')))" -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        throw $_
    }

    # Test 3: Get first client detail
    if ($clients.Length -gt 0) {
        $clientId = $clients[0].id
        Write-Host "`n[3/5] Testing GET /api/clients/$($clientId.Substring(0, 8))..."
        try {
            $client = Invoke-RestMethod "http://localhost:8000/api/clients/$clientId" -ErrorAction Stop
            Write-Host "✓ Client: $($client.name)" -ForegroundColor Green
            Write-Host "  County: $($client.county)" -ForegroundColor Gray
            Write-Host "  Conviction: $($client.conviction_type)" -ForegroundColor Gray
        } catch {
            Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
            throw $_
        }

        # Test 4: Run analysis on client
        Write-Host "`n[4/5] Testing POST /api/analyze/$($clientId.Substring(0, 8))..."
        try {
            $analysis = Invoke-RestMethod -Method POST "http://localhost:8000/api/analyze/$clientId" -ErrorAction Stop -ContentType "application/json"
            Write-Host "✓ Analysis complete" -ForegroundColor Green
            Write-Host "  Urgency: $($analysis.urgency)" -ForegroundColor Gray
            Write-Host "  Benefits: $($analysis.benefits.Length) programs" -ForegroundColor Gray
            Write-Host "  Action items: $($analysis.action_items.Length) items" -ForegroundColor Gray
            Write-Host "  Intake summary: $($analysis.intake_summary)" -ForegroundColor Gray
            if ($analysis.catch_two.has_catch_two) {
                Write-Host "  Catch-22 detected: $($analysis.catch_two.agency_name)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
            throw $_
        }
    }

    # Test 5: Create new client
    Write-Host "`n[5/5] Testing POST /api/clients (create new client)..."
    try {
        $newClient = @{
            name = "Test Client"
            release_date = "2026-05-20"
            county = "Fulton County, GA"
            conviction_type = "property"
            age = 35
            is_veteran = $false
            has_dependents = $false
        } | ConvertTo-Json

        $created = Invoke-RestMethod -Method POST -ContentType "application/json" -Body $newClient "http://localhost:8000/api/clients" -ErrorAction Stop
        Write-Host "✓ Client created: $($created.name)" -ForegroundColor Green
        Write-Host "  ID: $($created.id.Substring(0, 8))..." -ForegroundColor Gray
    } catch {
        Write-Host "✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        throw $_
    }

    Write-Host "`n=== ALL TESTS PASSED ===" -ForegroundColor Green

} finally {
    Write-Host "`nStopping server..." -ForegroundColor Cyan
    Get-Process -Id $proc.Id -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "Server stopped" -ForegroundColor Gray
}
