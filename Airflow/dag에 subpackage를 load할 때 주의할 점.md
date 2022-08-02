- Use unique top package name
	- dag/common files를 구분하기 위한 서브디렉토리 명을 기타 다른 subpackage의 이름과 겹치지 않게 할 것
	- 같은 이름을 사용하게 되면 충돌할 수 있음
	- airflow/operators 디렉토리는 이미 airflow.operators 패키지가 존재하기 때문에 `from airflow.operators`로는 참조 불가

- Don't use relative imports
	- python 코드를 어떻게 실행하느냐에 따라 다른 결과가 발생

- Add \_\_init\_\_.py in package folders


## Creating a package in Python
- 커스텀 python code를 추가하기 위한 방법
- 일일이 코드를 추가하고 관리하는 것은 버전 관리등의 측면에서 비효율적