# Small copies of the togt pictures for the lists (Frit spil's maps, the togt list). Sixteen full
# pictures side by side take more of a phone's picture memory than Chrome keeps while scrolling, so
# parts of them went blank. Run from the repository after adding or changing a picture:
#   powershell -File tools/make-thumbs.ps1
Add-Type -AssemblyName System.Drawing
$width = 400
$out = Join-Path $PSScriptRoot '..\assets\togter\small'
New-Item -ItemType Directory -Force $out | Out-Null
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$quality = New-Object System.Drawing.Imaging.EncoderParameters 1
$quality.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]72)
Get-ChildItem (Join-Path $PSScriptRoot '..\assets\togter\*.jpg') | ForEach-Object {
  $src = [System.Drawing.Image]::FromFile($_.FullName)
  $height = [int]($src.Height * $width / $src.Width)
  $bmp = New-Object System.Drawing.Bitmap $width, $height
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($src, 0, 0, $width, $height)
  $g.Dispose(); $src.Dispose()
  $bmp.Save((Join-Path $out $_.Name), $jpeg, $quality)
  $bmp.Dispose()
  '{0} {1} KB' -f $_.Name, [int]((Get-Item (Join-Path $out $_.Name)).Length / 1024)
}
