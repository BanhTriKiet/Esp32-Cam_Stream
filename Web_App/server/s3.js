import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { createReadStream } from "fs"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { Readable } from "stream"
import dotenv from 'dotenv'

dotenv.config()

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.AWS_REGION
// const accessKey = process.env.ACCESS_KEY
// const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region: bucketRegion,
});


export async function uploadToBucket(folder, prefix, fileName, name) {
    const uploadParams = {
        Bucket: bucketName,
        Body: createReadStream(fileName),
        ContentType: "video/mp4",
        Key: folder + "/" + prefix + "/" + name,
    }
    await s3Client.send(new PutObjectCommand(uploadParams))
}
