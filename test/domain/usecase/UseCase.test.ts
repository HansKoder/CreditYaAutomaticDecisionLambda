import { DecisionLoanCommand } from "../../../src/domain/usecase/Command";
import { DecisionLoanUseCase } from "../../../src/domain/usecase/UseCase";

describe("Domain (UseCase) UseCase", () => {
    it("should get TRUE since the user complies with risk policies correctly", async () => {

        const props: DecisionLoanCommand = {
            currentLoanAmount: 1000,
            currentLoanId: '103',
            customerSalary: 10000,
            debts: [ { "debt": 1000, "loanId": "101"}, { "debt": 1000, "loanId": "102"}]
        };

        const usecase = new DecisionLoanUseCase();
        const resp = await usecase.execute(props);

        expect(resp).toBeTruthy();
    });

        it("should return FASLE since the user does not comply with risk policies correctly", async () => {

        const props: DecisionLoanCommand = {
            currentLoanAmount: 3000,
            currentLoanId: '103',
            customerSalary: 10000,
            debts: [ { "debt": 1000, "loanId": "101"}, { "debt": 1000, "loanId": "102"}]
        };

        const usecase = new DecisionLoanUseCase();
        const resp = await usecase.execute(props);

        expect(resp).toBeFalsy();
    });
});

