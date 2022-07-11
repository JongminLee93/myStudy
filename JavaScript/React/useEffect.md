# useEffect

- React에서 DOM을 업데이트한 뒤 추가로 코드를 실행해야 하는 경우.

- Hook을 이용하여 컴포넌트가 렌더링 이후에 어떤 일을 수행시킴

- React에서는 useEffect를 통해 넘긴 함수(effect)를 기억했다가 DOM 업데이트 이후에 호출

- 외부 데이터를 가져오거나 API를 불러내는 일

- useEffect 함수를 컴포넌트 내부에 두는 이유

	- 컴포넌트의 prop나 state 변수에 접근하기 위해서 > 컴포넌트 내부에 있기 때문에 특별한 API가 필요하지 않음

- useEffect 함수는 렌더링 이후 매번 수행됨

- effect가 실행됐다? = DOM이 업데이트됐다

```javascript
import React, {useState, useEffect} from 'react';

function Example() {
	const [count, setCount] = useState(0);
	
	// effect hook : Example component의 마운트 / 업데이트 이후에 실행
	useEffect(() => {
		document.title = 'You clicked ${count} times';
	});

	return (
		<div>
			<p>You clicked {count} times</p>
			<button onClick={() => setCount(count+1)}> Click me </button>
		</div>
	)
}
```

- clean up 이 필요한 경우 useEffect안에 return 문에 함수를 추가

- 컴포넌트가 언마운트될 때 실행

```javascript
import React, {useState, useEffect} from 'react';

function Example() {
	const [count, setCount] = useState(0);
	
	// effect hook : Example component의 마운트 / 업데이트 이후에 실행
	useEffect(() => {
		document.title = 'You clicked ${count} times';
		return function cleanup() {
			console.log('component unmount');
		};
	});

	return (
		<div>
			<p>You clicked {count} times</p>
			<button onClick={() => setCount(count+1)}> Click me </button>
		</div>
	)
}
```

참고문서 : [리액트 공식 홈페이지](https://ko.reactjs.org/)