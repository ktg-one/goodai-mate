# init.ps1 — Good'ai Project Dev Environment Setup
# Run: powershell -ExecutionPolicy Bypass -File init.ps1

Write-Host "`n=== Good'ai Dev Environment Setup ===" -ForegroundColor Cyan

# 1. Install npm dependencies
Write-Host "`n[1/4] Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed" -ForegroundColor Red
    exit 1
}

# 2. Install Three.js for SDF shader background
Write-Host "`n[2/4] Installing Three.js (^0.164.1)..." -ForegroundColor Yellow
npm install three@^0.164.1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Three.js install failed" -ForegroundColor Red
    exit 1
}
npm install -D @types/three

# 3. Install AI SDK dependencies
Write-Host "`n[3/4] Installing AI SDK dependencies..." -ForegroundColor Yellow
npm install @ai-sdk/openai-compatible ai

# 4. Verify next.config.ts exists (GLSL raw imports will be configured by coding agent)
Write-Host "`n[4/4] Verifying project structure..." -ForegroundColor Yellow
if (-not (Test-Path "next.config.ts")) {
    Write-Host "WARNING: next.config.ts not found — create it before running dev server" -ForegroundColor Yellow
} else {
    Write-Host "next.config.ts found" -ForegroundColor Green
}

if (-not (Test-Path "src/app/layout.tsx")) {
    Write-Host "WARNING: src/app/layout.tsx not found" -ForegroundColor Yellow
} else {
    Write-Host "src/app/layout.tsx found" -ForegroundColor Green
}

# 5. Check for .env file
if (-not (Test-Path ".env.local")) {
    Write-Host "`nWARNING: .env.local not found. Copy .env.example and fill in values:" -ForegroundColor Yellow
    Write-Host "  cp .env.example .env.local" -ForegroundColor Gray
    Write-Host "  Required: AI_GATEWAY_API_KEY, WEB3FORMS_KEY" -ForegroundColor Gray
}

# 6. Start dev server
Write-Host "`n=== Starting Dev Server ===" -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000" -ForegroundColor Green
Write-Host "Stack: Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui" -ForegroundColor Gray
Write-Host "Shader: Three.js SDF lens blur (copper on onyx)" -ForegroundColor Gray
Write-Host "AI: Vercel AI Gateway -> anthropic/claude-sonnet-4-20250514" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Gray

npm run dev
