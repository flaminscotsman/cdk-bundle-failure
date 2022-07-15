import { SQSClient, GetQueueUrlCommand, SendMessageCommand } from '@aws-sdk/client-sqs'
import { env } from 'process'

const client = new SQSClient({})
const queueUrl = await async function() {
    if (!env.SQS_QUEUE_NAME) {
        throw new Error("Environment variable SQS_QUEUE_NAME must point to an SQS queue")
    }
    const queue = await client.send(new GetQueueUrlCommand({QueueName: env.SQS_QUEUE_NAME}))
    if (!queue.QueueUrl) {
        throw new Error(`Failed to resolve url for queue ${env.SQS_QUEUE_NAME}`)
    }
    return queue.QueueUrl
}()

export async function handler(request: AWSLambda.EventBridgeEvent<'Scheduled Event', {}>, context: AWSLambda.Context) {
    await client.send(new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: request.time
    }))
}