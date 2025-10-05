import to from "await-to-js";

import { SQSEvent } from "aws-lambda"; 
import { SeflDecisionLambda } from "./SeflDecisionLambda";

const seflDecisionLambda = new SeflDecisionLambda();

export const handler = async (event: SQSEvent) => {
    console.log(`seflDecisionLambda=>${JSON.stringify(seflDecisionLambda)}`);

    const [err, _] = await to(seflDecisionLambda.handler(event));

    if (err) {
      console.error(`[infra.entrypoint.lambda] (handler) self-loan decision, Payload=[ err:${err} ]`)
      return {
        statusCode: 500,
        body: JSON.stringify({
          status: 500,       
          message: err.message
        })
      }
    }

    return {
      statusCode: 204,
      body: {}
    }
};
