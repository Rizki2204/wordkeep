@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $desk = [Environment]::GetFolderPath('Desktop'); $lnk = $ws.CreateShortcut((Join-Path $desk 'Wordkeep — Belajar Bahasa Inggris.lnk')); $lnk.TargetPath = 'd:\Tools_Bahasa_Inggris\Wordkeep.exe'; $lnk.WorkingDirectory = 'd:\Tools_Bahasa_Inggris'; $lnk.IconLocation = 'd:\Tools_Bahasa_Inggris\wordkeep.ico'; $lnk.Description = 'Wordkeep — Aplikasi Belajar Bahasa Inggris Mandiri (A1-C2)'; $lnk.Save()"
echo.
echo ====================================================================
echo  Shortcut "Wordkeep — Belajar Bahasa Inggris" berhasil dipasang
echo  di layar Desktop kamu!
echo ====================================================================
pause
