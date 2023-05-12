# getopt
쉘 프로그램에서 옵션을 파싱해주는 명령어.

```
$ getopt --help
Usage:
 getopt optstring parameters
 getopt [options] [--] optstring parameters
 getopt [options] -o|--options optstring [options] [--] parameters

Options:
 -a, --alternative            Allow long options starting with single -
 -h, --help                   This small usage guide
 -l, --longoptions <longopts> Long options to be recognized
 -n, --name <progname>        The name under which errors are reported
 -o, --options <optstring>    Short options to be recognized
 -q, --quiet                  Disable error reporting by getopt(3)
 -Q, --quiet-output           No normal output
 -s, --shell <shell>          Set shell quoting conventions
 -T, --test                   Test for getopt(1) version
 -u, --unquoted               Do not quote the output
 -V, --version                Output version information
```

### 사용법
- csh 환경
- `optstring` : 프로그램의 옵션으로 설정할 문자, `:`를 붙여서 추가적인 파라미터를 넘겨줄 수 있다.
- `parameters` : 프로그램에 넘겨주는 파라미터
- `while`문 `switch`문 `shift`문을 조합해서 옵션에 따른 프로그램 수행을 달리 할 수 있다.
```
$ cat test.csh
#!/bin/csh -f
set argv = `getopt "abc" $*`
echo $argv

$ ./test.csh -abc
-a -b -c --
```

```
$ cat test.csh
#!/bin/csh -f
set argv = `getopt "ab:c:" $*`
echo $argv
while ($#argv)
  switch ($1)
    case -a:
      echo a option
      breaksw
    case -b:
      shift
      echo $1
      breaksw
    case -c:
      shift
      echo $1
      breaksw
  endsw
  shift
end

$ ./test.csh -a -b hello c world
-a -b 'hello' -c 'world' --
a option
hello
world
```

- `--` 를 기준으로 getopt에 넘기는 파라미터를 구분
- 따라서 getopt의 옵션을 사용할 때 `--` 뒤에 파라미터를 넘겨줘야 한다.
  - example
  ```
  set argv = `getopt -o "abc" -- $*`
  ```
- long option(--option)을 파싱할 수도 있다.
```
$ cat test.csh
#!/bin/csh -f
set argv = `getopt -o "" -l "lopt:" -- $*`  # No short option, one long option (lopt)
while ($#argv)
  switch ($1)
    case --lopt:
    shift
    echo $1
    breaksw
  endsw
  shift
end

$ ./test.csh --lopt "this is long option"
this is long option
```
