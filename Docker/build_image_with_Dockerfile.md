# Build image with Dockerfile

Dockerfile을 통해서 이미지를 빌드하는 방법

도커의 이미지들은 기본 이미지(예를 들면 리눅스 배포판 이미지)에 특정 명령의 Layer들을 쌓아서 만든다

apache/airflow:2.3.3의 히스토리를 살펴보면
```
$ docker history apache/airflow:2.3.3 
IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
eb63ad63a57f   3 weeks ago   CMD []                                          0B        buildkit.dockerfile.v0
<missing>      3 weeks ago   ENTRYPOINT ["/usr/bin/dumb-init" "--" "/entr…   0B        buildkit.dockerfile.v0
<missing>      3 weeks ago   LABEL org.apache.airflow.distro=debian org.a…   0B        buildkit.dockerfile.v0
<missing>      3 weeks ago   ENV BUILD_ID= COMMIT_SHA=                       0B        buildkit.dockerfile.v0
<missing>      3 weeks ago   ARG AIRFLOW_IMAGE_DATE_CREATED                  0B        buildkit.dockerfile.v0
<missing>      3 weeks ago   ARG AIRFLOW_IMAGE_REPOSITORY                    0B        buildkit.dockerfile.v0
<missing>      3 weeks ago   ARG COMMIT_SHA                                  0B        buildkit.dockerfile.v0
...
```
여러 개의 레이어가 나온다

이미지는 이런 레이어들의 최종적인 합

컨테이너가 만들어질 때 해당 이미지의 위에 컨테이너 레이어가 생성되는 것

이 레이어들은 각각 도커파일에서의 명령줄로 치환

다음과 같이 Dockerfile을 만들고 빌드해보면

```Dockerfile
FROM apache/airflow:2.3.3
RUN pip install -U pip
RUN pip install --no-cache-dir wget
```

```
$ docker build -t my-airflow:1.0 .
[+] Building 0.2s (7/7) FINISHED
 => [internal] load build definition from Dockerfile 
 => => transferring dockerfile: 37B 
 => [internal] load .dockerignore 
 => => transferring context: 2B 
 => [internal] load metadata for docker.io/apache/airflow:2.3.3 
 => [1/3] FROM docker.io/apache/airflow:2.3.3 
 => CACHED [2/3] RUN pip install -U pip 
 => CACHED [3/3] RUN pip install --no-cache-dir wget 
 => exporting to image 
 => => exporting layers 
 => => writing image sha256:cafda4c585be28beec4cd3b23b488e89881e84367f6aeb704fc38b806c79dd9a 
 => => naming to docker.io/library/my-airflow:1.0 

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
```

새로 만든 my-airflow:1.0의 히스토리를 보면

```
$ docker history my-airflow:1.0 
IMAGE          CREATED         CREATED BY                                      SIZE      COMMENT
cafda4c585be   9 minutes ago   RUN /bin/bash -o pipefail -o errexit -o noun…   41.9kB    buildkit.dockerfile.v0
<missing>      9 minutes ago   RUN /bin/bash -o pipefail -o errexit -o noun…   13.4MB    buildkit.dockerfile.v0
<missing>      3 weeks ago     CMD []                                          0B        buildkit.dockerfile.v0
<missing>      3 weeks ago     ENTRYPOINT ["/usr/bin/dumb-init" "--" "/entr…   0B        buildkit.dockerfile.v0
<missing>      3 weeks ago     LABEL org.apache.airflow.distro=debian org.a…   0B        buildkit.dockerfile.v0
<missing>      3 weeks ago     ENV BUILD_ID= COMMIT_SHA=                       0B        buildkit.dockerfile.v0
<missing>      3 weeks ago     ARG AIRFLOW_IMAGE_DATE_CREATED                  0B        buildkit.dockerfile.v0
<missing>      3 weeks ago     ARG AIRFLOW_IMAGE_REPOSITORY                    0B        buildkit.dockerfile.v0
...
```
apache/airflow:2.3.3의 히스토리에는 없던 두줄이 위에 추가된 것을 확인할 수 있다. 