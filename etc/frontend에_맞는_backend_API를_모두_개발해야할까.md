## Frontend에 필요한 모든 Backend API를 개발해야할까?
### 배경
프로젝트를 진행하면서 하나의 데이터 소스를 활용해서 다양한 차트를 개발 중인 상황이었습니다. 차트마다 필요한 데이터 구조에 맞게 Backend API를 구성하던 중, 데이터 소스는 하나이기 때문에 데이터를 불러오는 과정에서 중복된 형태를 거치게 된다 점을 알게됐습니다. 그래서 Backend API를 일일히 개발하지 말고 하나의 API에서 받아온 데이터를 frontend에서 필요한 형태로 가공하는 것이 좋은지, 혹은 Frontend에 맞는 Backend API를 각각 구성하는게 좋을지 의문이 들었습니다.

### 본론
API가 확정되지 않은 상황에서 raw 데이터 모델을 기반으로 Frontend에 필요한 데이터로 가공하게 되면, 해당 API의 모델이 변경될 시 Frontend 로직들도 변경해줘야하는 상황이 발생합니다. 그러므로 공통된 Backend API에서부터 Frontend에 필요한 모델로 변경해주는 Adapter가 필요합니다. 중간에 Adapter가 존재하면 Backend API가 변경될 때 Frontend의 로직이 변경될 필요 없이 Adapter의 로직만 변경되면 됩니다. 그 반대의 상황에서도 Frontend의 변경이 Backend의 변경으로 이어지지 않게 됩니다.

### 결론
Backend API로 보내준 데이터를 Frontend에 맞게 가공하도록 Frontend [Adapter](https://refactoring.guru/ko/design-patterns/adapter)를 구성해 볼 생각입니다. [이 글](https://fe-developers.kakaoent.com/2022/221127-api-layer/)을 참고하여 RTK Query로 Adapter를 구성하려 합니다. 

### 참고
 - [BFF(Backend For Frontend)](https://fe-developers.kakaoent.com/2022/220310-kakaopage-bff/)
 - [`API 언제 나오나요?` 로 부터 독립하기](https://fe-developers.kakaoent.com/2022/221127-api-layer/)
 - [FE개발자로서 못해준 이야기 2 - 컴포넌트](https://partnerjun.tistory.com/83)