import to from "await-to-js";

import { SQSEvent } from "aws-lambda"; 
import { IDecisionLoanUseCase } from "../../domain/usecase/IUseCase";
import { DecisionLoanUseCase } from "../../domain/usecase/UseCase";
import { DecisionLoanCommand } from "../../domain/usecase/Command";

const useCase: IDecisionLoanUseCase = new DecisionLoanUseCase();

export const handler = async (event: SQSEvent) => {
    console.log(`[infra.entrypoint.lambda] (handler) auto-loan decision`)

    if (!event?.Records || event.Records.length === 0) {
        console.log(`[infra.entrypoint.lambda] (handler) error=event must be mandatory return bad request`);
        return { statusCode: 400, body: "Bad Request" };
    }

    const record = event.Records[0];
    let payload: DecisionLoanCommand;

    try {
        payload = JSON.parse(record.body) as DecisionLoanCommand;
        return await loanDecision(payload);
    } catch (err) {
        console.log(`[infra.entrypoint.lambda] (handler) error=invalid JSON body, Payload=[ body:${record.body} ]`);
        return { statusCode: 400, body: "Invalid JSON body" };
    }
};

const loanDecision = async (payload: DecisionLoanCommand) => {
  console.log(`[infra.entrypoint.lambda] (handler) auto-loan decision, payload=[ props:${JSON.stringify(payload)} ]`)
  const [err, isApproved] = await to(useCase.execute(payload));

  if (err) {
    console.error(`[infra.entrypoint.lambda] (handler) auto-loan decision, Error, unexpected error, Payload=[ err:${err} ]`)
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,       
        message: `Unexpected error during loan decision, ${String(err)}`
      })
    }
  }

  if (isApproved) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        loanId: payload.currentLoanId,
        decision: "APPROVED",
        reason: ""
      })
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({
        loanId: payload.currentLoanId,
        decision: "REJECTED",
        reason: "Customer does not have enough resources for the loan"
      })
    }
  }
}
