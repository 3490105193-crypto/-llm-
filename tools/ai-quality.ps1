Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

$requiredPaths = @(
  "AGENTS.md",
  "README.md",
  "SECURITY.md",
  ".editorconfig",
  ".gitattributes",
  ".gitignore",
  "docs/architecture/overview.md",
  "docs/architecture/repo-memory.md",
  "docs/architecture/module-map.md",
  "docs/architecture/dependencies.md",
  "docs/architecture/risk-register.md",
  "docs/architecture/technical-debt.md",
  "docs/decisions/0001-ai-native-baseline.md",
  "docs/decisions/0002-defer-runtime-test-tooling.md",
  "docs/patterns/ai-engineering-workflow.md",
  "docs/patterns/testing.md",
  "docs/patterns/security.md",
  "tests/README.md",
  "e2e/README.md",
  ".codex/skills/project-engineering-workflow/SKILL.md",
  ".codex/skills/project-engineering-workflow/agents/openai.yaml"
)

$missing = @()
foreach ($path in $requiredPaths) {
  if (-not (Test-Path -LiteralPath $path)) {
    $missing += $path
  }
}

if ($missing.Count -gt 0) {
  Write-Error ("Missing required baseline paths:`n" + ($missing -join "`n"))
}

$textFilePatterns = @("*.md", "*.yml", "*.yaml", "*.ps1", "*.txt", "*.json", "*.toml")
$excludedDirs = @(".git", "node_modules", "dist", "build", "coverage", "playwright-report", "test-results")

$files = Get-ChildItem -Recurse -File -Include $textFilePatterns | Where-Object {
  $fullName = $_.FullName
  foreach ($dir in $excludedDirs) {
    if ($fullName -like "*\$dir\*") {
      return $false
    }
  }
  return $true
}

$placeholderHits = @()
$trailingWhitespaceHits = @()
$secretHits = @()
$placeholderPattern = "\[" + "TODO"

$secretPatterns = @(
  "AKIA[0-9A-Z]{16}",
  "-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----",
  "gh[pousr]_[A-Za-z0-9_]{36,}",
  "github_pat_[A-Za-z0-9_]{80,}",
  "sk-[A-Za-z0-9_-]{24,}",
  "xox[baprs]-[A-Za-z0-9-]{20,}"
)

foreach ($file in $files) {
  if ($file.Length -gt 1MB) {
    continue
  }

  $relativePath = Resolve-Path -Relative $file.FullName
  $content = Get-Content -LiteralPath $file.FullName -Raw
  $lines = Get-Content -LiteralPath $file.FullName

  if ($content -match $placeholderPattern) {
    $placeholderHits += $relativePath
  }

  for ($index = 0; $index -lt $lines.Count; $index++) {
    if ($lines[$index] -match "\s+$") {
      $trailingWhitespaceHits += "${relativePath}:$($index + 1)"
    }
  }

  foreach ($pattern in $secretPatterns) {
    if ($content -match $pattern) {
      $secretHits += "$relativePath matched $pattern"
    }
  }
}

if ($placeholderHits.Count -gt 0) {
  Write-Error ("Template placeholders remain:`n" + (($placeholderHits | Sort-Object -Unique) -join "`n"))
}

if ($trailingWhitespaceHits.Count -gt 0) {
  Write-Error ("Trailing whitespace found:`n" + (($trailingWhitespaceHits | Sort-Object -Unique) -join "`n"))
}

if ($secretHits.Count -gt 0) {
  Write-Error ("Potential secrets found:`n" + (($secretHits | Sort-Object -Unique) -join "`n"))
}

Write-Host "AI quality gate passed."
