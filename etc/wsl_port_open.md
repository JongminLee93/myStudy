## WSL 개발 서버 로컬 네트워크와 연결하기
### 배경
 - 회사 window pc에 wsl로 개발 중
 - pc는 고정 ip로 사용중
 - 로컬 네트워크에서 고정 ip 및 포트로 접속해도 개발 화면에 접속하지 못하는 문제

### 원인
 - wsl 인스턴스는 자체적인 ip를 가짐
 - 윈도우 pc의 고정 ip로 연결해도 wsl 인스턴스로 포트 포워딩이 되어있지 않아서 문제 발생

### 해결
 1. 관리자 권한 powershell
 2. `netsh interface portproxy add v4tov4 listenaddress={pc 고정 ip 주소} listenport={개방할 port}  connectaddress={트래픽을 전달할 wsl 인스턴스 ip} connectport={개방할 wsl 인스턴스 port}`

### 참고
 - pc의 port 번호와 wsl의 port 번호가 일치할 필요는 없음
 - 포트 포워딩 규칙 확인
   - `netsh interface portproxy show all`
 - 포트 포워딩 규칙 제거
   - `netsh interface portproxy delete v4tov4 listenaddress={포트포워딩 ip} listenport={포트포워딩 port}`