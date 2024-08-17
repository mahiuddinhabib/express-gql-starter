import { S3 } from 'aws-sdk';
import config from '../config';

const s3 = new S3({
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    signatureVersion: 'v4',
});

const generateUploadURL = async (
    fileName: string,
    fileType: string,
): Promise<string> => {
    const params = {
        Bucket: config.aws.bucketName,
        Key: fileName,
        Expires: 60, // URL expiration time in seconds
        ContentType: fileType,
    };

    return s3.getSignedUrlPromise('putObject', params);
};

export default generateUploadURL;
