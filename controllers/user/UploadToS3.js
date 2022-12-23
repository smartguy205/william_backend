import AWS from "aws-sdk";
import dotenv from 'dotenv';
dotenv.config();

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_SECRET_KEY
});


const UploadToS3 = async (filename, response) => {
    let s3 = new AWS.S3({
        // endpoint: "s3.us-east-1.amazonaws.com",
        signatureVersion: "v4",
        region: "us-east-1"
    })

    var params = {
        Bucket: 'luke-pdf-bucket',
        Key: filename,
        Body: response.file.data,
        ContentType: response.file.mimetype,
        ACL: 'public-read',
    }

    let returnObj = {};
    return new Promise((res, rej) =>
        s3.upload(params, (err, data) => {
            if (err) {
                returnObj = { success: false, msg: 'Error occured while trying to upload to S3 bucket' }
                res(returnObj);
            }
            else if (data?.Location) {
                returnObj = { success: true, msg: "File uploaded and data successfully submitted" }
                res(returnObj);
            }
            else {
                returnObj = { success: false, msg: "Something went wrong, Possibly file not saved" }
                res(returnObj);
            }
        }))



    //return returnObj;
}

export default UploadToS3