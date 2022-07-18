ls -1 : 파일 목록이 파일별로 한줄씩 출력

wc [file]: 파일의 줄 수, 단어 수, 바이트를 출력   
wc -l [file] : 파일의 줄 수 출력

| : pipeline으로 앞의 명령어의 결과를 뒤의 명령어의 입력으로 전달

ex) ls -1 | wc -l : 현재 폴더의 파일 목록을 한줄씩 출력한 것을 wc가 받아 총 몇줄인지 출력 >> 현재 폴더의 파일 개수

- [mkdir](./mkdir.md) : 디렉토리 생성

- [sed](./sed.md) : 파일 내용 필터링

- wget : 

- sync
- rsync
- crontab : 윈도우의 스케줄러
- su - [user] : user로 사용자 변경
