$r = Invoke-WebRequest -Uri 'http://localhost:5173/socket.io/?EIO=4&transport=polling' -UseBasicParsing -TimeoutSec 5
Write-Output "Status: $($r.StatusCode)"
Write-Output "Content: $($r.Content)"
