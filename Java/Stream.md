# Stream API

 - 자바에서 함수형 프로그래밍을 지원하기 위한 API

 - Stream은 말 그대로 '데이터의 흐름'

 - 배열이나 컬렉션에 저장된 데이터들이 순차적으로 함수로 가공되어 최종적으로 다른 컬렉션에 저장되거나 하게 됨


## 결과 만들기

### `Collect(Collector Collector)`

 - 함수로 데이터를 가공한 뒤의 결과를 List, Set, Map 등의 컬렉션의 저장하는 경우

 - 매개변수로 Collector 인터페이스를 구현한 클래스의 인스턴스가 필요

 - `Collectors` 클래스를 통해 다양한 `Collector` 인터페이스 구현체를 제공

   #### 1. `Collectors.groupingBy()`
   - Stream으로 가공한 데이터들을 특정 그룹으로 묶을 때
   - 최종 결과물은 Map으로 반환되며 같은 그룹의 객체들은 List로 묶여있다.
