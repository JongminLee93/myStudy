### Issue
wsl 특정 위치에서 vscode를 열기위해 code . 를 실행하는 경우 아래 에러와 함께 실행되지 않음.
```
Unable to connect to VS Code server: Error in request - ENOENT /run/user/1000/vscode-ipc-*.sock #157275
```

답변
https://github.com/microsoft/vscode/issues/157275#issuecomment-1890408573
```
loginctl enable-linger $(whoami)
```
