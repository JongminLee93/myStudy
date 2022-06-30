import java.util.ArrayList;
import java.util.List;

public class Stream_2 {
	public static void main(String[] args) {
		List<Product> pList = new ArrayList<>();

		pList.add(new Product(1000, 10, "키보드", "타자치기 좋아요."));
		pList.add(new Product(1500, 15, "마우스", "좋아요."));
		pList.add(new Product( 200, 12, "껌", "타자치기 좋아요."));
		pList.add(new Product(5000, 12, "데스크탑", "타자치기 좋아요."));
		pList.add(new Product(2000, 13, "노트북", "타자치기 좋아요."));

		for(Product p : pList) {
			if (p.getAmount() < 13) {
				System.out.println(p.getName()+"의 수량이 부족해요");
			}
		}

		pList.stream()
			.filter(p -> p.getAmount() < 13)
			.forEach(p -> System.out.println(p.getName()+"의 수량이 부족합니다."));


	}	
}
