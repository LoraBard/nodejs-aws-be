import ProductService from "../productsService";
import createResponse from "../helpers/createResponse";
import { NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } from "../constants";

export const getProductsById = async (event) => {
  const { id } = event.pathParameters;
  let response = null;
  try {
    const product = new ProductService().getProductById(id);
    if (!product) {
      response = createResponse(404, {
        message: NOT_FOUND_ERROR,
      });
    } else {
      response = createResponse(200, product);
    }
    return await response;
  } catch (error) {
    response = createResponse(500, {
      message: `${INTERNAL_SERVER_ERROR}. ${error}`,
    });
  }
};
