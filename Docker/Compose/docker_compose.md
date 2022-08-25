# Docker Compose
멀티 컨테이너 앱을 실행시키기 위한 도구

docker-compose.yaml 파일에 컨테이너를 실행시키기 위한 옵션들을 미리 적어두고 나중에 실행

```yaml
version: "3"  # optional since v1.27.0
services:
  web:
    build: .
    ports:
      - "8000:5000"
    volumes:
      - .:/code
      - logvolume01:/var/log
    links:
      - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```

version


services: 하위에 정의된 내용이 각각의 컨테이너
  - web: 컴포즈로 올릴 컨테이너 명
