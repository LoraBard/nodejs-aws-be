import ProductService from "../productsService";
import createResponse from "../helpers/createResponse";
import { INTERNAL_SERVER_ERROR } from "../constants";

export const getProductsList = async () => {
  let response = null;
  try {
    const productsList = new ProductService().getProductsList();
    response = createResponse(200, productsList);
    return await response;
  } catch (error) {
    response = createResponse(500, {
      message: `${INTERNAL_SERVER_ERROR}. ${error}`,
    });
  }
};
