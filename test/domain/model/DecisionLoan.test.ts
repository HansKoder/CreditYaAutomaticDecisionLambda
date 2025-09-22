import { DecisionLoan } from "../../../src/domain/model/DecisionLoan";
import { DebtVO } from "../../../src/domain/model/vo/DebtVO";
import { SalaryVo } from "../../../src/domain/model/vo/SalaryVO";

describe("Domain (aggregateroot) DecisionLoan", () => {

    it("should get current sum of all actived debts", () => {
        const list: DebtVO[] = [
            DebtVO.create('101', 1500),
            DebtVO.create('102', 1500)
        ]

        const domain = DecisionLoan.create({
            debts: list,
            customerSalary: SalaryVo.create(9000),
            loanSubmitted: DebtVO.create('103', 2000)
        })

        expect(domain.currentMonthlyDebtCalculation())
        .toEqual(3000)
    }); 


    it("should get max capacity debt on base customer salary", () => {

        const domain = DecisionLoan.create({
            debts: [],
            customerSalary: SalaryVo.create(10000),
            loanSubmitted: DebtVO.create('103', 2000)
        })

        expect(domain.calculationMaximumBorrowingCapacity())
        .toEqual(3500)
    }); 


    it("should get 1500 (available borrowing capacity)", () => {
        const list: DebtVO[] = [
            DebtVO.create('101', 1000),
            DebtVO.create('102', 1000)
        ]

        const domain = DecisionLoan.create({
            debts: list,
            customerSalary: SalaryVo.create(10000),
            loanSubmitted: DebtVO.create('103', 1000)
        })

        expect(domain.calculationAvailableBorrowingCapacity())
        .toEqual(1500)
    }); 

    it("should get (TRUE) since loan submitted debt is 1000 and avaialable borrowing is 1500", () => {
        const list: DebtVO[] = [
            DebtVO.create('101', 1000),
            DebtVO.create('102', 1000)
        ]

        const domain = DecisionLoan.create({
            debts: list,
            customerSalary: SalaryVo.create(10000),
            loanSubmitted: DebtVO.create('103', 1000)
        })

        expect(domain.isApprovedLoanSubmitted())
        .toBeTruthy()
    }); 


    it("should get (FALSE) since loan submitted debt is 3000 and avaialable borrowing is 1500", () => {
        const list: DebtVO[] = [
            DebtVO.create('101', 1000),
            DebtVO.create('102', 1000)
        ]

        const domain = DecisionLoan.create({
            debts: list,
            customerSalary: SalaryVo.create(10000),
            loanSubmitted: DebtVO.create('103', 3000)
        })

        expect(domain.isApprovedLoanSubmitted())
        .toBeFalsy();
    }); 


});