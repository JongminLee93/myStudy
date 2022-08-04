# Customize Docker image

도커 이미지를 커스터마이징해 내 어플리케이션에 알맞은 환경을 만들 수 있다. 

방법은 두 가지

- docker commit 명령어를 사용하는 방법

- Dockerfile을 이용해서 이미지를 빌드하는 방법

Docker에서 커스텀 이미지를 만들 때 권장하는 방법은 Dockerfile을 사용하는 방법

> Generally, it is better to use Dockerfiles to manage your images in a documented and maintainable way.

docker commit으로 만들어진 이미지는 어떤 변경이 있었는지 추적하기 쉽지 않다

이미지를 재생산하기 위해선 기본 이미지에 어떤 변경이 가해졌는지 알아야 하는데 이를 적어둔 것이 Dockerfile

## docker commit

컨테이너의 파일시스템 변경으로부터 새로운 이미지 생성

기본 이미지로 만들어진 컨테이너가 추가적인 명령으로 파일시스템이 변경된 후 이를 새로운 이미지로 만드는 것

```
docker commit [option] [컨테이너 명] [새로 만들 이미지 명:태그]
```

## [Build image with Dockerfile](./build_image_with_Dockerfile.md)

Dockerfile로부터 새로운 이미지를 빌드하는 방법

Dockerfile만 있다면 얼마든지 이미지를 다시 만들 수 있기 때문에 재생산하기 좋음

