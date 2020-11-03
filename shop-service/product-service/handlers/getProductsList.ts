import { APIGatewayProxyResult } from "aws-lambda";

import ProductService from "../productsService";
import createResponse from "../helpers/createResponse";
import delayResponse from '../helpers/delayResponse';
import { INTERNAL_SERVER_ERROR } from "../constants";

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  let response = null;
  try {
    const productsList = await delayResponse(ProductService.getProductsList(), 400);
    response = createResponse(200, productsList);
    return response;
  } catch (error) {
    response = createResponse(500, {
      message: `${INTERNAL_SERVER_ERROR}. ${error}`,
    });
    return response;
  }
};
