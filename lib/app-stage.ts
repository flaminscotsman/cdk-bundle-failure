import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ConsumerStack } from "./consumer-stack";
import { ProducerStack } from "./producer-stack";

export class ApplicationStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props)

        const consumer = new ConsumerStack(this, 'Consumer')
        const producer = new ProducerStack(this, 'Producer', {
            destination: consumer.queue
        })
    }
}