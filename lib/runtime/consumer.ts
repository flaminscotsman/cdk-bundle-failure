export async function handler(request: AWSLambda.SQSEvent, context: AWSLambda.Context) {
    for (const record of request.Records) {
        console.log(`I got ${record}`)
    }
}