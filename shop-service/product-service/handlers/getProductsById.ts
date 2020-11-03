import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

import ProductService from "../productsService";
import createResponse from "../helpers/createResponse";
import { NOT_FOUND_ERROR, INTERNAL_SERVER_ERROR } from "../constants";

export const getProductsById = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters;
  let response = null;
  try {
    const product = new ProductService().getProductById(id);
    if (!product) {
      response = createResponse(400, {
        message: NOT_FOUND_ERROR,
      });
    } else {
      response = createResponse(200, product);
    }
    return await Promise.resolve(response);
  } catch (error) {
    response = createResponse(500, {
      message: `${INTERNAL_SERVER_ERROR}. ${error}`,
    });
    return await Promise.resolve(response);
  }
};
