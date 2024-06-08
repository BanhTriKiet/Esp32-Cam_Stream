import AWS from 'aws-sdk'
import dotenv from 'dotenv'

dotenv.config()

AWS.config.update({
    region: process.env.AWS_REGION,
})

const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const TABLE_NAME = "saved_videos";

export async function addOrUpdateVideoInfos(videoInfos) {
    const params = {
        TableName: TABLE_NAME,
        Item: videoInfos,
    }
    return await dynamoClient.put(params).promise();
}

export async function getAllVideosInfos() {
    const params = {
        TableName: TABLE_NAME
    }
    const videosInfos = await dynamoClient.scan(params).promise();
    // console.log(videosInfos)
    return videosInfos.Items;
}

export async function getVideosInfosByTime(fromTime, toTime) {
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "#time >= :from_time AND #time <= :to_time",
        ExpressionAttributeNames: { "#time": "time" },
        ExpressionAttributeValues: {
            ':from_time': fromTime,
            ':to_time': toTime,
        }
    }
    const videosInfos = await dynamoClient.scan(params, function (err, data) {
        if (err) console.log(err);
        // else console.log(data);
    }).promise();
    return videosInfos.Items
}