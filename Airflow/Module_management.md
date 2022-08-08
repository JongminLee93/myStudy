# Module management

dag파일에 필요한 모듈을 airflow가 load할 수 있도록 하는 3가지 방법

- Airflow에서 기본적으로 PYTHONPATH에 추가하는 폴더에 모듈 코드를 추가

- 모듈 코드가 위치한 폴더를 PYTHONPATH에 추가

- 모듈 코드를 python package로 패키징(배포)하고 이를 Airflow와 함께 설치

## Airflow에서 PYTHONPATH 확인하는 방법

Python이 모듈을 load하는 directory는 sys.path를 통해서 확인 가능
```python
$ python
Python 3.7.13 (default, Jun 23 2022, 12:05:54) 
[GCC 10.2.1 20210110] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys
>>> from pprint import pprint
>>> pprint(sys.path)
['',
 '/usr/local/lib/python37.zip',
 '/usr/local/lib/python3.7',
 '/usr/local/lib/python3.7/lib-dynload',
 '/home/airflow/.local/lib/python3.7/site-packages',
 '/usr/local/lib/python3.7/site-packages']
 ```

혹은 airflow info 명령어를 통해서도 확인 가능
```bash
$ airflow info

...
Paths info
airflow_home    | /opt/airflow
system_path     | /root/bin:/home/airflow/.local/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
python_path     | /home/airflow/.local/bin:/usr/local/lib/python37.zip:/usr/local/lib/python3.7:/usr/local/lib/python3.7/lib-dynload
                | :/home/airflow/.local/lib/python3.7/site-packages:/usr/local/lib/python3.7/site-packages:/opt/airflow/dags
                | :/opt/airflow/config:/opt/airflow/plugins
airflow_on_path | True
...
```
/opt/airflow/dags /opt/airflow/config /opt/airflow/plugins

위 경로들은 Airflow가 실행될 때 추가됨

## custom python code 패키징 시 주의할 점

Use unique top package name

- 디렉토리 명을 기타 다른 subpackage의 이름과 겹치지 않게 할 것

- 같은 이름을 사용하게 되면 충돌할 수 있음

- airflow/operators 디렉토리는 이미 airflow.operators 패키지가 존재하기 때문에 `from airflow.operators`로는 참조 불가

Don't use relative imports

	- python 코드를 어디서 실행하느냐에 따라 다른 결과가 발생

Add \_\_init\_\_.py in package folders

## Creating a package in Python

custom python code를 추가하기 위한 방법 중 하나

일일이 코드를 추가하고 관리하는 것은 버전 관리등의 측면에서 비효율적

지속적인 유지보수가 필요한 코드인 경우에는 유용할 수 있으나 그럴 필요가 없는 경우는 과할 수 있음
