import * as Joi from "joi";

import { CustomError } from "../models";

const schema = Joi.object({
  title: Joi.string().min(3).max(250).required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().positive().required(),
  count: Joi.number().positive().default(0),
}).error((error: any) => {
  throw new CustomError(error);
});

export default schema;
