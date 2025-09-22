
import { SQSEvent } from "aws-lambda";
import { handler } from "../../../src/infrastructure/entrypoint/Lamda";

describe("NotificationLambda handler", () => {

  it("should return 400 when event is null", async () => {
    const response = await handler(null as unknown as SQSEvent);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("Bad Request");
  });

    it("should return 400 when Records array is empty", async () => {
    const emptyEvent: SQSEvent = { Records: [] } as unknown as SQSEvent;

    const response = await handler(emptyEvent);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("Bad Request");
  });

    it("should return 400 when json has an invalid format", async () => {
    const sqsEvent: SQSEvent = {
      Records: [
        {
          messageId: "1",
          receiptHandle: "abc",
          body: "invalid format",
        },
      ],
    } as unknown as SQSEvent;

    const response = await handler(sqsEvent);

    expect(response.statusCode).toBe(400);
    expect(response.body).toBe("Invalid JSON body");
  });
  
  it("should return 500 when usecase fails when salary is negative", async () => {
    const sqsEvent: SQSEvent = {
      Records: [
        {
          messageId: "1",
          receiptHandle: "abc",
          body: JSON.stringify({
            customerSalary: -10,
            currentLoanId: "101",
            currentLoanAmount: 1000,
            debts: [ { loanId: "101", debt: 1000}, { loanId: "102", debt: 1000} ],
          }),
        },
      ],
    } as unknown as SQSEvent;

    const response = await handler(sqsEvent);

    expect(response.statusCode).toBe(500);
  });


  it("should return 200 when usecase succeeds is approved", async () => {
    const sqsEvent: SQSEvent = {
      Records: [
        {
          messageId: "1",
          receiptHandle: "abc",
          body: JSON.stringify({
            customerSalary: 10000,
            currentLoanId: "101",
            currentLoanAmount: 1000,
            debts: [ { loanId: "101", debt: 1000}, { loanId: "102", debt: 1000} ],
          }),
        },
      ],
    } as unknown as SQSEvent;

    const response = await handler(sqsEvent);

    expect(response.statusCode).toBe(200);
  });


  it("should return 200 when usecase succeeds is rejected", async () => {
    const sqsEvent: SQSEvent = {
      Records: [
        {
          messageId: "1",
          receiptHandle: "abc",
          body: JSON.stringify({
            customerSalary: 10000,
            currentLoanId: "101",
            currentLoanAmount: 3000,
            debts: [ { loanId: "101", debt: 1000}, { loanId: "102", debt: 1000} ],
          }),
        },
      ],
    } as unknown as SQSEvent;

    const response = await handler(sqsEvent);

    expect(response.statusCode).toBe(200);
  });


});