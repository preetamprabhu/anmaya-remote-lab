[Setup]
AppName=Remote Lab Server
AppVersion=1.0
DefaultDirName={pf}\Remote Lab Server
DefaultGroupName=Remote Lab Server
UninstallDisplayIcon={app}\server.exe
OutputBaseFilename=Remote Lab Server Installer
OutputDir=D:\website\Anmaya\anmaya-remote-lab\installer
SetupIconFile=D:\website\Anmaya\anmaya-remote-lab\static\icon.ico

[Files]
; Copy your server executable and static files
Source: "D:\website\Anmaya\anmaya-remote-lab\server.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "D:\website\Anmaya\anmaya-remote-lab\static\*"; DestDir: "{app}\static"; Flags: ignoreversion recursesubdirs

[Registry]
; Add to Windows startup
Root: HKLM; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "YourServerApp"; ValueData: """{app}\server.exe"""; Flags: uninsdeletevalue

[Icons]
Name: "{group}\Remote Lab Server"; Filename: "{app}\server.exe"
Name: "{group}\Uninstall Remote Lab Server"; Filename: "{uninstallexe}"

[Run]
Filename: "{app}\server.exe"; Description: "Launch application"; Flags: postinstall nowait