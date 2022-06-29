# Stream API

 - 자바에서 배열과 컬렉션에 저장된 데이터를 다루기 위한 API
   - 배열, 컬렉션에 저장된 데이터에 접근하기 위해서는 반복문이나 반복자(iterator)를 사용하여 매번 새로운 코드를 작성
   
   - 이는 가독성과 코드의 재사용성을 떨어뜨림

   - 데이터마다 접근 방식이 다르기 때문

   - 이 문제를 극복하기 위해 스트림 API에서는 __데이터를 추상화하여 다양한 데이터를 읽고 쓰기 위한 공통의 방법을 제공__

   - 이러한 특징 때문에 파일에 저장된 데이터도 모두 같은 방법으로 다룰 수 있게 됨

 - 배열이나 컬렉션에 저장된 데이터들이 순차적으로 함수로 가공되어 최종적으로 다른 컬렉션에 저장되거나 하게 됨

![Stream API](http://www.tcpschool.com/lectures/img_java_stream_operation_principle.png) [^source]



## 결과 만들기

### `Collect(Collector Collector)`

 - 함수로 데이터를 가공한 뒤의 결과를 List, Set, Map 등의 컬렉션의 저장하는 경우

 - 매개변수로 Collector 인터페이스를 구현한 클래스의 인스턴스가 필요

 - `Collectors` 클래스를 통해 다양한 `Collector` 인터페이스 구현체를 제공

   #### 1. `Collectors.groupingBy()`
   - Stream으로 가공한 데이터들을 특정 그룹으로 묶을 때
   - 최종 결과물은 Map으로 반환되며 같은 그룹의 객체들은 List로 묶여있다

[^source]: <http://www.tcpschool.com/java/java_stream_concept>