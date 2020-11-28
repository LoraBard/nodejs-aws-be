import { Context, S3Event } from "aws-lambda";
import * as AWS from "aws-sdk";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import * as csv from "csv-parser";
import * as dotenv from "dotenv";

import createResponse from "../helpers/createResponse";

dotenv.config();

export const importFileParser = async (
  event: S3Event,
  context: Context
): Promise<any> => {
  console.log(
    `Event:\n ${JSON.stringify(event)}\nContext:\n${JSON.stringify(context)}`
  );
  try {
    const { BUCKET } = process.env;
    const s3 = new AWS.S3({ region: "eu-west-1" });
    const sqs = new AWS.SQS({ region: "eu-west-1" });
    const url = process.env.SQS_URL;

    await Promise.all(
      event.Records.map(async (record) => {
        return await new Promise((resolve, reject) => {
          s3.getObject({
            Bucket: BUCKET,
            Key: record.s3.object.key,
          })
            .createReadStream()
            .pipe(csv())
            .on("data", async (data) => {
              const MessageBody = JSON.stringify(data);
              console.log(MessageBody);

              await sqs.sendMessage(
                {
                  QueueUrl: url,
                  MessageBody
                },
                () => console.log(`Message body: ${MessageBody}`)
              ).promise();
      
            })
            .on("end", async () => {
              await s3
                .copyObject({
                  Bucket: BUCKET,
                  CopySource: `${BUCKET}/${record.s3.object.key}`,
                  Key: record.s3.object.key.replace("uploaded", "parsed"),
                })
                .promise();

              await s3
                .deleteObject({
                  Bucket: BUCKET,
                  Key: record.s3.object.key,
                })
                .promise();

              resolve();
            })
            .on("error", (error) => {
              reject(error);
            });
        });
      })
    );

    return createResponse(StatusCodes.ACCEPTED, ReasonPhrases.ACCEPTED);
  } catch (error) {
    return createResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${ReasonPhrases.INTERNAL_SERVER_ERROR}. ${error.toString()}`
    );
  }
};
