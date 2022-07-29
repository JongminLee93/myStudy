# date
- Display the current time in the given FORMAT, or set th system date

- Usage
	```
	$ date [Option]... [+Format]
	 
	$ date
	Wed Jul 27 17:44:28 KST 2022

	$ date +%Y
	2022

	$ date -d'1 days ago' +%Y%m%d
	20220726
	```

- Options

	- -d[date] (--date) : 명령 실행 시점이 아닌 [date]에 명시한 시점을 기준으로 formatting하여 표출
	
