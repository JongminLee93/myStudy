## DI(Dependency Injection) 의존성 주입
 - 추상화를 해치지 않고 의존성을 인수로 넘겨주는 것

 - 더 중요한 모듈이 덜 중요한 모듈에 의존하면 안된다.

	- 자동차를 자동차 바퀴 크기에 맞춰서 만드는 건 말이 안된다. 

	- 자동차 바퀴를 자동차에 맞게 만들어 원하는 대로 갈아끼울수 있도록 해야 함.

 - DI와 IoC는 별개로 DI를 무조건 IoC를 통해서 해야 하는 건 아님

 - IoC를 통한 DI를 도입하기 전에 IoC 컨테이너의 학습비용과 weakly typed의 비용을 고려해야 함
 
 - IoC 컨테이너를 통한 DI 도입으로 발생하는 의존성 등록 비용 감소가 위 둘의 비용을 넘어선다는 확신이 생기기 전까지는 Pure DI를 유지하는 것이 좋다.


## DI 방식

### 1. @Autowired와 같이 어노테이션을 활용한 필드 주입

``` java
@Controller
public class SomeController {

  @Autowired
  private SomeService someService;
}
```
	
 - IoC 컨테이너가 의존성을 알아서 주입하기 때문에 간편
 - 먼저 Controller 객체를 생성 후에 나중에 service 객체를 주입하기 때문에 순환참조등의 문제가 발생할 수 있음
 - final을 통한 불변성을 보장할 수 없음
 - 직접 의존성을 주입할 수 없어 순수 자바 코드만으로 테스트가 어려움

 ### 2. setter를 활용한 수정자 주입
 
``` java
@Controller
public class SomeController {

  private SomeService someService;

  public void setSomeService(SomeService someService) {
    this.someService = someService;
  }

}
```
 - 먼저 Controller 객체를 생성 후에 나중에 service 객체를 주입하기 때문에 순환참조등의 문제가 발생할 수 있음
 - final을 통한 불변성을 보장할 수 없음

### 3. constructor를 활용한 생성자 주입
``` java
@Controller
public class SomeController {

  private final SomeService someService;

  public SomeController(SomeService someService) {
    this.someService = someService;
  }

}
```
 - someService 없이는 someContoller도 생성 불가능 > 순환참조의 문제를 컴파일 단계에서 알 수 있음
 - final을 통한 불변성을 보장 가능