import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { join } from 'path';

interface ProducerStackProps extends StackProps {
  readonly destination: IQueue
}

export class ProducerStack extends Stack {
  public readonly queue: IQueue

  constructor(scope: Construct, id: string, props: ProducerStackProps) {
    super(scope, id, props);

    const handler = new NodejsFunction(this, 'Consumer', {
      entry: join(__dirname, 'runtime', 'producer.ts'),
      environment: {
        SQS_QUEUE_NAME: props.destination.queueName
      },
      runtime: Runtime.NODEJS_16_X,
      bundling: {
        format: OutputFormat.ESM,
        mainFields: ['module', 'main'],
      }
    })
    props.destination.grantSendMessages(handler)
    
    new Rule(this, 'Scheduler', {
      schedule: Schedule.rate(Duration.minutes(5)),
      targets: [new LambdaFunction(handler)]
    })
  }
}
