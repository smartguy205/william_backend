import AWS from "aws-sdk";
import getUniqueCode from "../../utils/getUniqueCode.js";
import dotenv from "dotenv";
dotenv.config();

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_SECRET_KEY
});

const s3 = new AWS.S3({
    signatureVersion: "v4",
    region: "us-east-1"
});

export const createS3PreSignedUrl = {

    createUrl: async (fileName, res) => {
        try {
            const type = 'putObject';
            let code = getUniqueCode(8);
            console.log(res.body)
            if (!code) {
                return res.status(400).json({ success: false, msg: "Cannot get unique code for the file" })
            }

            let s3key = `${code}_${fileName}`;
            let bucket = process.env.S3_BUCKET_NAME
            const params = {
                Bucket: bucket,
                Key: s3key,
                ContentType: 'multipart/form-data',
                // ContentType: 'application/pdf',
                Expires: 3000,
                ACL: 'public-read',
            }
            const URL = await s3.getSignedUrl(type, params);
            //console.log("URL", URL);
            let link = `https://${bucket}.s3.amazonaws.com/${s3key}`;
            // let link = `https://s3.console.aws.amazon.com/s3/object/${bucket}?region=us-east-1&prefix=${s3key}`;

            return res.json({ success: true, msg: "Url generated", url: URL, file: link })
        }
        catch (error) {
            return res.json({ success: false, error: "No Url generated", error })
        }
    }
}