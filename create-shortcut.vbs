Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\Music Player.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = WScript.ScriptFullName.Replace("create-shortcut.vbs", "start-electron.bat")
oLink.WorkingDirectory = WScript.ScriptFullName.Replace("create-shortcut.vbs", "")
oLink.Description = "Ad-Free Music Player Desktop App"
oLink.IconLocation = WScript.ScriptFullName.Replace("create-shortcut.vbs", "build\icon.png")
oLink.Save

MsgBox "Desktop shortcut created successfully!" & vbCrLf & vbCrLf & "You can now launch Music Player from your desktop!", vbInformation, "Music Player"
