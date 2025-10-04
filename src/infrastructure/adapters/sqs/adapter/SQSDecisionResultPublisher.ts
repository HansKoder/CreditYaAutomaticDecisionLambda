import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { DecisionResultPublisher } from "../../../../domain/model/gateway/DecisionResultPublisher";
import { DecisionResultVO } from "../../../../domain/model/vo/DecisionResultVO";

import { to } from "await-to-js";
import { SQSInfraException } from "../exception/SQSInfraException";

export class SQSDecisionResultPublisher implements DecisionResultPublisher {

    private queueUrl = process.env.RESPONSE_QUEUE_URL;
    private sqs = new SQSClient({ region: process.env.REGION });

    async publish(decisionResult: DecisionResultVO): Promise<void> {
        console.log(`[infra.adapter.sqs] (publish) publish decision result, payload=[${JSON.stringify(decisionResult)}]`)

        const command = new SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(decisionResult),
        });
        
        const [err, resp] = await to(this.sqs.send(command));

        if (err) {
            console.log(`[infra.adapter.sqs] (publish) it cannot send message, payload=[ error:${JSON.stringify(err)}]`)
            throw new SQSInfraException(`It cannot send message, error detail: ${err.message}`);
        }

        console.log(`[infra.adapter.sqs] (publish) event was published ith successful, payload=[ resp:${JSON.stringify(resp)}]`)
    }
    
}