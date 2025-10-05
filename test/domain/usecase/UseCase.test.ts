import to from "await-to-js";
import { DecisionResultPublisher } from "../../../src/domain/model/gateway/DecisionResultPublisher";
import { DecisionResultVO } from "../../../src/domain/model/vo/DecisionResultVO";
import { DecisionLoanCommand } from "../../../src/domain/usecase/Command";
import { DecisionLoanUseCase } from "../../../src/domain/usecase/UseCase";
import { SQSInfraException } from "../../../src/infrastructure/adapters/sqs/exception/SQSInfraException";

describe("Domain (UseCase) UseCase", () => {

    it('(execute) Should be published with final decision (approved)', async () => {

        class MockPublisher implements DecisionResultPublisher {
            async publish(_: any): Promise<void> { }
        }

        const publisher = new MockPublisher();
        const spy = jest.spyOn(publisher, "publish").mockResolvedValue();

        const useCase = new DecisionLoanUseCase(publisher);

        const command: DecisionLoanCommand = {
            customerSalary: 1200,
            currentLoanId: '102',
            currentLoanAmount: 100,
            debts: [{ loanId: '101', debt: 100 }]
        };

        await useCase.execute(command);

        expect(spy).toHaveBeenCalledTimes(1);

        const expectedResult = new DecisionResultVO('102', 'APPROVED', 'Customer has debt capacity');
        expect(spy).toHaveBeenCalledWith(expectedResult);
    });


    it('(execute) Should be published with final decision (rejected) since the customer has a bunch of debts', async () => {

        class MockPublisher implements DecisionResultPublisher {
            async publish(_: any): Promise<void> { }
        }

        const publisher = new MockPublisher();
        const spy = jest.spyOn(publisher, "publish").mockResolvedValue();

        const useCase = new DecisionLoanUseCase(publisher);

        const command: DecisionLoanCommand = {
            customerSalary: 1200,
            currentLoanId: '103',
            currentLoanAmount: 300,
            debts: [
                { loanId: '101', debt: 100 },
                { loanId: '102', debt: 300 }
            ]
        };

        await useCase.execute(command);

        expect(spy).toHaveBeenCalledTimes(1);

        const expectedResult = new DecisionResultVO('103', 'REJECTED', 'Customer does not have debt capacity');
        expect(spy).toHaveBeenCalledWith(expectedResult);
    });

    it('(execute) Should have a throw error', async () => {

        class MockPublisher implements DecisionResultPublisher {
            async publish(_: any): Promise<void> { }
        }

        const publisher = new MockPublisher();
        const spy = jest
            .spyOn(publisher, "publish")
            .mockRejectedValue(new SQSInfraException("Unexpected error"));

        const useCase = new DecisionLoanUseCase(publisher);

        const command: DecisionLoanCommand = {
            customerSalary: 1200,
            currentLoanId: "102",
            currentLoanAmount: 100,
            debts: [{ loanId: "101", debt: 100 }],
        };

        const [err, _] = await to(useCase.execute(command));

        expect(spy).toHaveBeenCalledTimes(1);
        expect(err).toBeInstanceOf(SQSInfraException);
        expect(err?.message).toBe("Unexpected error");
    });

});

