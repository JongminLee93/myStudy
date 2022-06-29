
public class Product {
	private int price;
	private int amount;
	private String name;
	private String desc;

	public int getPrice() {
		return this.price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public int getAmount() {
		return this.amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDesc() {
		return this.desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public Product(int price, int amount, String name, String desc) {
		this.price = price;
		this.amount = amount;
		this.name = name;
		this.desc = desc;
	}
	
}
