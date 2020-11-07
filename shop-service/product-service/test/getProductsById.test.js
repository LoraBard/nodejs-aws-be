import { getProductsById } from "../handlers/getProductsById";
import mockData from "../mockData";
import { INTERNAL_SERVER_ERROR } from "../constants";

describe("product service", () => {
  let event;

  beforeEach(() => {
    event = {
      pathParameters: {
        id: mockData[0].id,
      },
    };
  });

  it("return well-formed response", async () => {
    const response = await getProductsById(event);

    expect(response.statusCode).toEqual(200);
    expect(response.headers).toEqual({ "Content-Type": "application/json" });
    expect(typeof response.body).toEqual("string");
  });

  it("return status code 404", async () => {
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
      expect(response.body).toEqual(`${INTERNAL_SERVER_ERROR}. ERROR`);
    }
  });
});
