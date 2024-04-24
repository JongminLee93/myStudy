### Spring Boot

내장 톰캣이 포함된 스프링

#### Annotation
`@RestController`
 - MVC 구조에서 controller임을 나타냄. `@Controller`와의 차이 확인 필요.

`@RequestMapping(value,...)`
 - value값을 통해서 URI와 매핑 가능
 - method 값을 통해서 어떤 http request와 매핑할지 설정 가능
 - 자매품 : `@GetMapping` 등등
 - `/api/{variable}/{type}`의 형태로 동적으로 uri를 통해 변수를 받을 수 있음.
   - 위 경우 request처리 과정에서 매개변수로 `@PathVariable`을 통해 처리해줘야 함
   - 변수 명과 매개변수 명이 일치하지 않아도 `@PathVariable`로 매핑 가능

서버에서 데이터를 어디까지 처리해서 넘겨줄 것인가.

