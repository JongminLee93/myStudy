# props (properties)
- 컴포넌트 외부에서 내부로 필요한 정보(값 또는 함수 등등)를 전달해주기 위해 사용
```javascript
function App() {
	return (
		<Hello name="react" />
	);
}

export default App;
```
```javascript
function Hello({name}) {
	return (
		<div>안녕하세요. {name}</div>
	);
}

export default Hello;
```

- 여러개의 props 전달 가능

```javascript
function App() {
	return (
		<Hello name="react" color="red"/>
	);
}

export default App;
```
```javascript
function Hello({name, color}) {
	return (
		<div style={{color}}>안녕하세요. {name}</div>
	);
}

export default Hello;
```
- {{color}}

	- 바깥 중괄호 : 여기에 js 문법을 쓸거라는 표시

	- 안쪽 중괄호 : 비구조화 할당으로 만든 js객체 = {color:color}

	- 외부에서 넘어오는게 문자열이 아닌 js 객체라면? >> 안쪽 중괄호 필요 없이 바로 객체를 넣으면 된다.

### 조건부 렌더링