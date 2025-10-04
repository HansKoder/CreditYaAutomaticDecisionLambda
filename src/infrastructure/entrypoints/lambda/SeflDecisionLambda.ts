import { SQSEvent } from "aws-lambda";
import { IDecisionLoanUseCase } from "../../../domain/usecase/IUseCase";
import { SQSDecisionResultPublisher } from "../../adapters/sqs/adapter/SQSDecisionResultPublisher";
import { DecisionLoanUseCase } from "../../../domain/usecase/UseCase";
import { DecisionLoanCommand } from "../../../domain/usecase/Command";
import { LambdaInfraException } from "./exception/LambdaInfraException";
import to from "await-to-js";

export class SeflDecisionLambda {

    private useCase: IDecisionLoanUseCase;

    constructor() {
        const publisher = new SQSDecisionResultPublisher();
        this.useCase = new DecisionLoanUseCase(publisher);
    }

    public async handler (event : SQSEvent) : Promise<void> {
        await this.processUseCase(this.checkPayload(event));
    }

    // checkPayload : DecisionPayload.
    private checkPayload (event: SQSEvent): DecisionLoanCommand {
        console.log(`[infra.entrypoint.lambda] (handler) self-loan decision`)

        if (!event?.Records || event.Records.length === 0) {
            console.log(`[infra.entrypoint.lambda] (handler) error=event must be mandatory return bad request`);
            throw new LambdaInfraException('Event must be mandatory');
        }

        const record = event.Records[0];
        let payload: DecisionLoanCommand;

        try {
            return payload = JSON.parse(record.body) as DecisionLoanCommand;            
        } catch (err) {
            console.log(`[infra.entrypoint.lambda] (handler) error=invalid JSON body, Payload=[ body:${record.body} ]`);
            throw new LambdaInfraException('Invalid Json Body');
        }
    }

    // processUseCase (): void
    private async processUseCase (payload: DecisionLoanCommand) : Promise<void> {
        console.log(`[infra.entrypoint.lambda] (handler) self-loan decision, payload=[ props:${JSON.stringify(payload)} ]`)
        const [err, _] = await to(this.useCase.execute(payload));
        
        if (err) {
            console.error(`[infra.entrypoint.lambda] (handler) self-loan decision, Error, unexpected error, Payload=[ err:${err} ]`);
            throw new LambdaInfraException(`Unexpected error during loan self decision, ${err.message}`);
        }

        console.error(`[infra.entrypoint.lambda] (handler) self-loan decision with successful`);
    }

}