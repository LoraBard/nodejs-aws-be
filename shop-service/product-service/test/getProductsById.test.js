import { getProductsById } from "../handlers/getProductsById";
import * as event from '../mockData/event.json';

describe("product service", () => {

  it("return well-formed response", async () => {
    const response = await getProductsById(event);

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
    expect(typeof response.body).toEqual("string");
  });

  it("return status code 400", async () => {
    event.pathParameters = {};
    const response = await getProductsById(event);

    expect(response.statusCode).toEqual(400);
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
      await getProductsById(event);
    } catch {
      expect(response.statusCode).toEqual(500);
      expect(response.headers).toEqual({ "Content-Type": "application/json" });
      expect(typeof response.body).toEqual("string");
    }
  });
});
