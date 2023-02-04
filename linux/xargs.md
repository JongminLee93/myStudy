### 배경
리눅스 명령어를 `|`를 통해 연결할 때 출력 결과가 다음 명령어로 이어지지 않는 경우 발생
```bash
$ cat example.txt
hello
I am file

$ cat example.txt | echo
(print nothing)

```

### 환경
 - bash 사용

### 해결
 - echo와 같은 특정 명령어는 파이프를 통한 표준 입력을 받지 못하는 듯?
 - xargs를 통해서 파이프 입력을 받고 이를 echo에 전달

```
$ cat example.txt | xargs echo
hello
I am file
```

### 궁금증
 - 파이프 연결이 안되는 명령어는 어떤 경우지?
 - xargs는 어떻게 작동하는 거지?
