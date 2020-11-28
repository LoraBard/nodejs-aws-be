import * as AWS from "aws-sdk";
import { Context, SQSEvent, SQSRecord } from "aws-lambda";

import { IProduct as Product } from "../models";
import ProductService from "../productsService";
import productSchema from "../validation/createRequest";

export const catalogBatchProcess = async (event: SQSEvent, context: Context): Promise<void> => {
  console.log(
    `Event: ${JSON.stringify(event)}, Context: ${JSON.stringify(context)}`
  );

  const sns = new AWS.SNS({ region: "eu-west-1" });
  const arn = process.env.SNS_ARN;

  try {
    const productsToUpload = filterProducts(event.Records);
    if (productsToUpload.length) {

      const products = await ProductService.uploadProducts(productsToUpload);

      const Message = `${JSON.stringify(
        products
      )} records were successfully added.`;
  
      await sns.publish(
          {
            Subject: "New Products are added",
            Message,
            TopicArn: arn,
            MessageAttributes: {
              countOfProducts: {
                DataType: "Number",
                StringValue: `${products.length}`
              }
            },
          },
          () => console.log(`Email is sent with: "${Message}" message`)
        ).promise();
    }

  } catch (error) {
    await sns.publish(
      {
        Subject: "Error is occured",
        Message: "Something went wrong",
        TopicArn: arn,
      },
      () => console.log('Email was sent')
    ).promise();
  }
};

const filterProducts = (records: SQSRecord[]): Product[] => {
  const products: Product[] = [];

  records.forEach(({ body }) => {
    const product = JSON.parse(body);
    const { value } = productSchema.validate(product);
    products.push(value);
  });

  return products;
};
