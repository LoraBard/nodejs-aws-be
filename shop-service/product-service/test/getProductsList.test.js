import { getProductsList } from "../handlers/getProductsList";

describe("product service", () => {
  it("return well-formed response", () => {
    getProductsList().then((result) => {
      expect(result.statusCode).toEqual(200);
      expect(result.headers).toEqual({ "Content-Type": "application/json" });
      expect(typeof result.body).toEqual("string");
    });
  });

  it("return status code 500 on error", () => {
    jest.mock('../productsService/index.ts', () => {
        return {
            getProductsList: () => {
                throw Error('ERROR');
            },
        };
    });
    getProductsList().catch((error) => {
      expect(error.statusCode).toEqual(500);
      expect(error.headers).toEqual({ "Content-Type": "application/json" });
      expect(typeof error.body).toEqual("string");
    });
  });
});
