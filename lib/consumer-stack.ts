import { Stack, StackProps } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { join } from 'path';

export class ConsumerStack extends Stack {
  public readonly queue: IQueue

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = this.queue = new Queue(this, 'queue')
    const handler = new NodejsFunction(this, 'Consumer', {
      entry: join(__dirname, 'runtime', 'consumer.ts'),
      runtime: Runtime.NODEJS_16_X,
      bundling: {
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
      }
    })
    handler.addEventSource(new SqsEventSource(queue))
  }
}
