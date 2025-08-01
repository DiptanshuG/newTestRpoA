import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file, productId, fileName) => {
    const key = `products/${productId}/${fileName}`;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        const data = await s3.upload(params).promise();
        return key; //data.Location;
    } catch (error) {
        throw new Error("Error uploading file to S3: " + error.message);
    }
};


