import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Stream_ {
	public static void main(String[] args) {
		List<Product> pList = new ArrayList<>();

		pList.add(new Product(1000, 10, "apple", "delicious"));
		pList.add(new Product(1500, 12, "바나나", "delicious"));
		pList.add(new Product(1200, 10, "배", "delicious"));
		pList.add(new Product(1300, 16, "자동차", "delicious"));
		pList.add(new Product(1100, 11, "김치", "delicious"));
		
		Map<Integer, List<Product>> resultMap = pList.stream().collect(Collectors.groupingBy(Product::getAmount));
		TreeMap<Integer, List<Product>> a = pList.stream().collect(Collectors.groupingBy(Product::getAmount, TreeMap::new, Collectors.toList()));


		System.out.println(resultMap);
		System.out.println(a);

	}
}