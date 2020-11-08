import { getProductsList } from "../handlers/getProductsList";

describe("product service", () => {
  it("return well-formed response", async () => {
    const response = await getProductsList();

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
    expect(typeof response.body).toEqual("string");
  });

  it("return status code 500 on error", async () => {
    jest.mock("../productsService/index.ts", () => {
      return {
        getProductById: () => {
          throw Error("ERROR");
        },
      };
    });

    try {
      await getProductsList();
    } catch {
      expect(response.statusCode).toEqual(500);
      expect(response.headers).toEqual({ "Content-Type": "application/json" });
      expect(typeof response.body).toEqual("string");
    }
  });
});
