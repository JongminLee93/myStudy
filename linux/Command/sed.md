# sed

- stream editor의 줄임말

- 입력을 받고 일부 내용을 변경하여 출력, 이 때 원본 파일은 변경하지 않음 (옵션을 통해 원본 파일 변경도 가능)

## 사용 예
```bash
#test.txt
hello world, my name is Lloyd

$ sed 's/Lloyd/Tom/g' test.txt

#standard out
hello world, my name is Tom

```

- 원본 파일은 변경되지 않고 표준 출력(화면 출력) 내용만 바뀌어서 출력

---

- -i[suffix]

- 원본 파일을 바로 수정, 이 때 원본 파일명에 [suffix]의 확장자가 붙은 백업 파일 생성

```bash
#test.txt
hello world, my name is Lloyd

$ sed -i'.org' 's/Lloyd/Tom/g' test.txt

#test.txt
hello world, my name is Tom

#test.txt.org
hello world, my name is Lloyd

```

