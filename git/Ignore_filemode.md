### 배경
 - git은 기본적으로 파일 권한 변경 내역까지 추적
 - 개발 과정에서 파일 권한 변경에 따른 내역을 모두 관리할 수 없으므로 이를 무시하도록 설정함

### 해결
```
git config core.fileMode false
```
