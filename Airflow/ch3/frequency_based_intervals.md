# Frequency-based Intervals

- cron 표현식은 언제마다 실행할 지 표헌할 수 있지만 얼마 주기마다 실행할 지는 표현하지 못 함

- 매주 월요일 00시 마다 실행 가능 but 매 3일마다 실행 은 표현하지 못 함

- Airflow에서는 datetime 라이브러리의 timedelta 인스턴스로 이를 표현함으로써 해결

```python
import datetime as dt

dag = DAG(
    dag_id="04_time_delta",
    schedule_interval=dt.timedelta(days=3),
    start_date=dt.datetime(year=2019, month=1, day=1),
    end_date=dt.datetime(year=2019, month=1, day=15),
)
# 1, 4, 7, 10, 13일 자정에 실행
```

- timedelta(minutes=10) : 매 10분마다 실행

- timedelta(hours=2) : 매 2시간마다 실행