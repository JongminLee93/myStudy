# JavaScript

## 배열 내장함수
- map : 배열 안의 각 원소들을 변환해 새로운 배열을 만들 때 사용
	- map함수에 주는 파라미터는 __배열의 원소를 변화시키는 함수__
	- 배열의 원소를 받아서 변화시켜 새로운 값으로 반환하는 함수
```javascript
const array = [1,2,3,4,5]; // 이 배열의 원소들을 모두 제곱한 새로운 배열을 만들고 싶다면?

//방법 1.
const squared = array.map(square);
const square = n => n**2;

//방법 2. 그냥 바로 안에서 구현해도 ok
const squared = array.map(n => n**2);
```

## ES6
- spread : 객체 혹은 배열을 펼친다.
	- 객체 혹은 배열이 있을 때 기존의 내용을 건들이지 않고 새로운 객체, 배열을 만들 때
	```javascript
	const user = {
		id: abc
		email: abc@naver.com
	}

	// 이때 전화번호를 추가한 새로운 객체를 만들고 싶다면?
	const newUser = {
		...user,
		phone: 010-1234-1234
	}
	```