import { SQSEvent } from "aws-lambda";
import { SeflDecisionLambda } from "../../../../src/infrastructure/entrypoints/lambda/SeflDecisionLambda";
import { DecisionLoanUseCase } from "../../../../src/domain/usecase/UseCase";
import { LambdaInfraException } from "../../../../src/infrastructure/entrypoints/lambda/exception/LambdaInfraException";

jest.mock("../../../../src/domain/usecase/UseCase"); // 🔥 Mock Use Case

describe("SeflDecisionLambda", () => {
    let lambda: SeflDecisionLambda;
    let mockExecute: jest.Mock;

    beforeEach(() => {
        mockExecute = jest.fn().mockResolvedValue(undefined);
        (DecisionLoanUseCase as jest.Mock).mockImplementation(() => ({
            execute: mockExecute,
        }));

        lambda = new SeflDecisionLambda();
    });

    it("(handler) should process valid SQS event successfully", async () => {
        const sqsEvent: SQSEvent = {
            Records: [
                {
                    messageId: "1",
                    body: JSON.stringify({
                        customerSalary: 1500,
                        currentLoanId: "001",
                        currentLoanAmount: 200,
                        debts: [{ loanId: "100", debt: 50 }],
                    }),
                } as any,
            ],
        };

        await lambda.handler(sqsEvent);

        expect(mockExecute).toHaveBeenCalledTimes(1);
        expect(mockExecute).toHaveBeenCalledWith({
            customerSalary: 1500,
            currentLoanId: "001",
            currentLoanAmount: 200,
            debts: [{ loanId: "100", debt: 50 }],
        });
    });

    it("(handler) should throw LambdaInfraException when event has no records", async () => {
        const sqsEvent = { Records: [] } as any;

        const promise = lambda.handler(sqsEvent);
        await expect(promise).rejects.toThrow(LambdaInfraException);
        await expect(promise).rejects.toThrow("Event must be mandatory");
    });

    it("(handler) should throw LambdaInfraException when JSON is invalid", async () => {
        const sqsEvent: SQSEvent = {
            Records: [{ body: "{ invalid json" } as any],
        };

        const promise = lambda.handler(sqsEvent);
        await expect(promise).rejects.toThrow(LambdaInfraException);
        await expect(promise).rejects.toThrow("Invalid Json Body");
    });


    it("(handler) should throw LambdaInfraException when use case fails", async () => {
        mockExecute.mockRejectedValue(new Error("Unexpected error"));

        const sqsEvent: SQSEvent = {
            Records: [
                {
                    messageId: "1",
                    body: JSON.stringify({
                        customerSalary: 1500,
                        currentLoanId: "002",
                        currentLoanAmount: 100,
                        debts: [],
                    }),
                } as any,
            ],
        };

        // 🔥 Ejecuta solo una vez
        const promise = lambda.handler(sqsEvent);

        await expect(promise).rejects.toThrow(LambdaInfraException);
        await expect(promise).rejects.toThrow("Unexpected error during loan self decision");

        expect(mockExecute).toHaveBeenCalledTimes(1);
    });


});
