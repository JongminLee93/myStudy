# Command

- `pull` : docker hub에 저장된 이미지를 받아오는 명령어
```bash
docker pull [이미지 명]:[태그]
```

- `images` : `pull`로 가져온 이미지의 목록을 확인하는 명령어
```bash
docker images
```

- `diff` : 컨테이너의 기본 이미지에서부터 지금까지의 컨테이너 파일시스템의 변화 목록 조회 명령어
```bash
docker diff [컨테이너 명]
```

- `commit` : 컨테이너 파일시스템 변화를 기반으로 새로운 도커 이미지 생성 명령어
```bash
docker commit [옵션] [컨테이너 명] [이미지 명:태그]	
```

- `rm` : 컨테이너 제거 명령어
```bash
docker rm [옵션] [컨테이너 명] [컨테이너 명] ...
```

- `rmi` : 이미지 제거 명령어
```bash
docker rmi [옵션] [이미지 명] [이미지 명] ...
```