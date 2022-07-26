# schedule interval

```python
import datetime as dt
from pathlib import Path

import pandas as pd
from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator

dag = DAG(
    dag_id="01_unscheduled",
    start_date=dt.datetime(2019, 1, 1),
    schedule_interval=None,
)

fetch_events = BashOperator(
    task_id="fetch_events",
    bash_command=(
        "mkdir -p /data && "
        "curl -o /data/events.json "
        "https:/ /localhost:5000/events"
    ),
    dag=dag,
)

def _calculate_stats(input_path, output_path):
    """Calculates event statistics."""
    events = pd.read_json(input_path)
    stats = events.groupby(["date", "user"]).size().reset_index()
    Path(output_path).parent.mkdir(exist_ok=True)
    stats.to_csv(output_path, index=False)

calculate_stats = PythonOperator(
    task_id="calculate_stats",
    python_callable=_calculate_stats,
    op_kwargs={
        "input_path": "/data/events.json",
        "output_path": "/data/stats.csv",
    },
    dag=dag,
)

fetch_events >> calculate_stats
```

- DAG의 실행주기를 변경하고 싶다면 dag 인스턴스에 `schedule_interval` 매개변수를 주면 됨

- 날마다 실행되게 하려면? `schedule_interval="@daily"`
    
    - 매일 자정마다 실행

- 이 때 DAG의 시작 기준시점은 `start_date`

    - 1월 1일 13시에 DAG를 등록하면 1월 2일 00시부터 interval 시작

- `end_date` 매개변수로 마지막 실행일을 줄 수도 있음

```python
dag = DAG(
    dag_id="01_unscheduled",
    start_date=dt.datetime(2022, 7, 10),
    end_date=dt.datetime(2022, 7, 15),
    schedule_interval=@daily,
)
```

- 좀 더 복잡한 주기성을 주고 싶다면?
    - cron-based intervals
    ```bash
    # ┌─────── minute (0 - 59)
    # │ ┌────── hour (0 - 23)
    # │ │ ┌───── day of the month (1 - 31)
    # │ │ │ ┌───── month (1 - 12)
    # │ │ │ │ ┌──── day of the week (0 - 6) (Sunday to Saturday;
    # │ │ │ │ │     7 is also Sunday on some systems)
    # * * * * *
    ```