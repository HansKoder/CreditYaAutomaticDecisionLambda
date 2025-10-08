import { DecisionLoan } from "../../../src/domain/model/DecisionLoan";
import { DebtVO } from "../../../src/domain/model/vo/DebtVO";
import { DecisionResultVO } from "../../../src/domain/model/vo/DecisionResultVO";
import { SalaryVo } from "../../../src/domain/model/vo/SalaryVO";

describe("Domain (aggregateroot) DecisionLoan", () => {

    it("(getFinalDecisionOfCreditDebt) Should be approved since customer has debt capacity", () => {
        const list: DebtVO[] = [
            DebtVO.create('101', 1000),
            DebtVO.create('102', 1000)
        ]

        const domain = DecisionLoan.create({
            debts: list,
            customerSalary: SalaryVo.create(10000),
            loanSubmitted: DebtVO.create('103', 1000)
        })

        let response: DecisionResultVO = domain.getFinalDecisionOfCreditDebt();

        expect(response.getLoanId()).toEqual('103');
        expect(response.getDecision()).toEqual('APPROVED');
        expect(response.getReason()).toEqual('Customer has debt capacity');
        expect(response.getResolutionType()).toEqual('SELF_DECISION');
    }); 


    it("(getFinalDecisionOfCreditDebt) Should be rejected since customer does not have debt capacity", () => {
        const list: DebtVO[] = [
            DebtVO.create('101', 1000),
            DebtVO.create('102', 1000)
        ]

        const domain = DecisionLoan.create({
            debts: list,
            customerSalary: SalaryVo.create(10000),
            loanSubmitted: DebtVO.create('103', 1500)
        })

        let response: DecisionResultVO = domain.getFinalDecisionOfCreditDebt();

        expect(response.getLoanId()).toEqual('103');
        expect(response.getDecision()).toEqual('REJECTED');
        expect(response.getReason()).toEqual('Customer does not have debt capacity');
        expect(response.getResolutionType()).toEqual('SELF_DECISION');
    }); 


});