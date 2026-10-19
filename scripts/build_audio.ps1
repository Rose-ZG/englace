$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$projectPath = Split-Path $PSScriptRoot -Parent
$items = Get-Content -LiteralPath (Join-Path $projectPath 'data/listening.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voices = @($synth.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -like 'en-*' })
if ($voices.Count -eq 0) { throw 'No English SAPI voice installed.' }
New-Item -ItemType Directory -Force -Path (Join-Path $projectPath 'audio') | Out-Null
foreach ($item in $items) {
    $voice = $voices | Where-Object { $_.VoiceInfo.Culture.Name -eq $item.accent } | Select-Object -First 1
    if (-not $voice) { $voice = $voices[0] }
    $synth.SelectVoice($voice.VoiceInfo.Name)
    $synth.Rate = 0
    $targetPath = Join-Path $projectPath $item.audio
    $synth.SetOutputToWaveFile($targetPath, (New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)))
    $synth.Speak(($item.lines.text -join ' ... '))
    $synth.SetOutputToNull()
    $item | Add-Member -NotePropertyName audioVoice -NotePropertyValue $voice.VoiceInfo.Name -Force
}
$synth.Dispose()
$items | ConvertTo-Json -Depth 20 | Set-Content -LiteralPath (Join-Path $projectPath 'data/listening.json') -Encoding UTF8
Write-Output "Generated $($items.Count) local synthetic audio files."
