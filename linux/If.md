# if문
```bash
if test -f '파일명'; then
	echo 'file exists';
fi

# 또는
if [ -f '파일명' ]; then	#[]안에 양 끝을 띄어쓰지 않으면 [-f: command not found... 오류 발생하니 주의
	echo 'file exists';	
fi
```

## test option
- -f : 파일이 있는지 확인
- -e : 파일, 디렉토리, 소켓이 있는지 확인
- -d : 디렉토리가 있는지 확인
