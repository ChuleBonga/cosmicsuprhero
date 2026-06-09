param(
  [Parameter(Mandatory = $true)]
  [string]$InputVideo,

  [string]$OutputDir = "public/assets/observatory",

  [int]$PosterSecond = 1,

  [int]$Crf = 34
)

$ErrorActionPreference = "Stop"

function Resolve-Tool {
  param([string]$Name)

  $tool = Get-Command $Name -ErrorAction SilentlyContinue
  if (-not $tool) {
    throw "$Name was not found on PATH. Install FFmpeg or provide it on PATH before running this script."
  }

  return $tool.Source
}

if (-not (Test-Path -LiteralPath $InputVideo)) {
  throw "Input video not found: $InputVideo"
}

$ffmpeg = Resolve-Tool "ffmpeg"
$resolvedOutputDir = Resolve-Path -LiteralPath "." | ForEach-Object {
  Join-Path $_.Path $OutputDir
}

New-Item -ItemType Directory -Force -Path $resolvedOutputDir | Out-Null

$mp4Path = Join-Path $resolvedOutputDir "observatory-intro.mp4"
$webmPath = Join-Path $resolvedOutputDir "observatory-intro.webm"
$posterPath = Join-Path $resolvedOutputDir "observatory-intro-poster.webp"

Write-Host "Preparing observatory intro assets..."
Write-Host "Input:  $InputVideo"
Write-Host "Output: $resolvedOutputDir"

Copy-Item -LiteralPath $InputVideo -Destination $mp4Path -Force

& $ffmpeg -y -i $mp4Path -c:v libvpx-vp9 -b:v 0 -crf $Crf -an $webmPath
& $ffmpeg -y -i $mp4Path -ss ("00:00:{0:D2}" -f $PosterSecond) -vframes 1 $posterPath

Write-Host ""
Write-Host "Created:"
Write-Host " - $mp4Path"
Write-Host " - $webmPath"
Write-Host " - $posterPath"
Write-Host ""
Write-Host "Review these files before enabling production intro assets in src/data/observatoryIntro.ts."
