# Installation docker on Ubuntu machine

## 개발환경

- OS : Ubuntu 22.04 LTS

## Installing docker engine

1. apt 패키지 목록 업데이트

```sh
sudo apt update
```

2. apt 패키지가 HTTPS 프로토콜을 통해서 작동하도록 추가 패키지 설치

```sh
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

3. 도커 공식 저장소의 gpg키 추가

```sh
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

4. 다음 명령으로 도커 저장소 설치
```sh
echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
	$(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

5. 추가한 패키지 인식을 위해 다시 한 번 패키지 업데이트
```sh
sudo apt update
```

6. 도커 엔진 설치
```sh
sudo apt install docker-ce
```

7. 설치 확인
```sh
sudo systemctl status docker

# output
● docker.service - Docker Application Container Engine
     Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2022-07-28 07:57:25 UTC; 24h ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 2792 (dockerd)
      Tasks: 22
     Memory: 325.5M
        CPU: 7min 31.152s
     CGroup: /system.slice/docker.service
             └─2792 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

※ sudo 없이 docker 명령어 실행

docker 그룹에 유저를 추가 후 재접속
```sh
sudo usermod -aG docker ${USER}

su - ${USER}
```
