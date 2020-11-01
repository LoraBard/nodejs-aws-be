import ProductService from "../productsService";
import mockData from "../mockData";

describe("product service", () => {
  const obj = new ProductService();

  it("getProductsList return mock data", () => {
    expect(obj.getProductsList()).toEqual(mockData);
  });

  it("getProductsList return setted data", () => {
    const data = [
      {
        count: 1,
        description: "test description",
        id: "1",
        price: 10,
        title: "title",
      },
    ];
    obj.setProductsList(data);
    expect(obj.getProductsList()).toEqual(data);
  });

  it("getProductById return undefined when item is not found", () => {
    expect(obj.getProductById("2")).toBe(undefined);
  });

  it("getProductById return item", () => {
    const item = {
      count: 1,
      description: "test description",
      id: "1",
      price: 10,
      title: "title",
    };
    expect(obj.getProductById("1")).toEqual(item);
  });
});
