# merge

- 브랜치를 병합하는 명령어

- 기본적으로 fast-forward 방식
	
	- fast-forward 방식은 병합보다는 따라가는 느낌

	- main 브랜치에서 feature 브랜치로 분기한 후 main에 다른 변경이 없는 경우

	- main에는 변경이 없기 때문에 main의 head를 feature로 옮기기만 하면 변경 적용 완료

	- 따라서 __새로운 commit없이 main의 head를 feature로 옮기기만 함__

	- 새로운 commit이 없기 때문에 언제 누가 merge했는지 이력이 남지 않는다는 문제가 있다.

- --no-ff

	- 말 그대로 fast-forward 방식이 아닌 commit을 남겨 병합하는 옵션 (3-way merge)

	- main과 feature로 분기한 이후 main에 다른 변경이 생긴 경우 (이런 경우에는 옵션을 주지 않아도 3-way merge)

	- 혹은 main에 다른 변경이 없더라도 merge commit을 남겨 이력을 남기고 싶은 경우

