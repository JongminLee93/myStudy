# cron-based intervals
 ```bash
# ┌─────── minute (0 - 59)
# │ ┌────── hour (0 - 23)
# │ │ ┌───── day of the month (1 - 31)
# │ │ │ ┌───── month (1 - 12)
# │ │ │ │ ┌──── day of the week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │     7 is also Sunday on some systems)
# * * * * *
```

### 사용 예시

- 0 * * * * = hourly (running on the hour)

- 0 0 * * * = daily (running at midnight)

- 0 0 * * 0 = weekly (running at midnight on Sunday)

- 0 0 1 * * = midnight on the first of every month

- 45 23 * * SAT = 23:45 every Saturday

, 와 -로 list와 ranged value로도 표현 가능

- 0 0 * * MON,WED,FRI = run every Monday, Wednesday, Friday at midnight

- 0 0 * * MON-FRI = run every weekday at midnight

- 0 0,12 * * * = run every day at 00:00 and 12:00

### cron의 문제점

- cron은 일정 주기를 갖는 시간 스텝을 표현하지 못함 (예를 들어 매 3일마다 한 번)

### 참고 사이트

- [cronitor](https://crontab.guru/) : cron 표현식을 해석해주는 사이트