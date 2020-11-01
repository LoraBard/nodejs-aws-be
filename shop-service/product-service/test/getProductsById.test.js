import { getProductsById } from "../handlers/getProductsById";
import mockData from "../mockData";

describe("product service", () => {
  let event;

  beforeEach(() => {
    event = {
      pathParameters: {
        id: mockData[0].id,
      },
    };
  });

  it("return well-formed response", () => {
    getProductsById(event).then((result) => {
      expect(result.statusCode).toEqual(200);
      expect(result.headers).toEqual({ "Content-Type": "application/json" });
      expect(typeof result.body).toEqual("string");
    });
  });

  it("return status code 404", () => {
    event.pathParameters = {};
    getProductsById(event).then((result) => {
      expect(result.statusCode).toEqual(404);
      expect(result.headers).toEqual({ "Content-Type": "application/json" });
      expect(typeof result.body).toEqual("string");
    });
  });

  it("return status code 500 on error", () => {
    jest.mock("../productsService/index.ts", () => {
      return {
        getProductsList: () => {
          throw Error("ERROR");
        },
      };
    });
    getProductsById(event).catch((error) => {
      expect(error.statusCode).toEqual(500);
      expect(error.headers).toEqual({ "Content-Type": "application/json" });
      expect(typeof error.body).toEqual("string");
    });
  });
});
