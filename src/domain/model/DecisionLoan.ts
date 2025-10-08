import { DebtVO } from "./vo/DebtVO";
import { DecisionResultVO } from "./vo/DecisionResultVO";
import { SalaryVo } from "./vo/SalaryVO";

export interface DecisionLoanProps {
  debts: DebtVO[];
  loanSubmitted: DebtVO;
  customerSalary: SalaryVo;
}

export class DecisionLoan {
  private readonly currentDebts: DebtVO[];
  private readonly loanSubmitted: DebtVO;
  private readonly salary: SalaryVo;

  private readonly INIT_VALUE: number = 0;
  private readonly POLICY_RISK = 0.35;

  private constructor(props: DecisionLoanProps) {
    this.currentDebts = props.debts;
    this.loanSubmitted = props.loanSubmitted;
    this.salary = props.customerSalary;
  }

  static create(props: DecisionLoanProps): DecisionLoan {
    return new DecisionLoan(props);
  }

  // Business Rules
  private currentMonthlyDebtCalculation (): number {
    console.log(`[domain] (currentMonthlyDebtCalculation) payload=[ loanID:{${this.loanSubmitted.getLoanId()}}, debts:{${JSON.stringify(this.currentDebts)}} ]`);

    const debt = this.currentDebts
    .map(i => i.getMonthlyDebt())
    .reduce((a: number, b: number) => {
      return a + b;
    },this.INIT_VALUE);

    console.log(`[domain] (currentMonthlyDebtCalculation) calculated debt, response=[ debt:{${debt}} ]`);

    return debt;
  }

  private calculationMaximumBorrowingCapacity (): number {
    console.log(`[domain] (calculationMaximumBorrowingCapacity) payload=[ loanID:{${this.loanSubmitted.getLoanId()}}`);
    const max = this.salary.getValue() * this.POLICY_RISK;

    console.log(`[domain] (calculationMaximumBorrowingCapacity) calculated capacity debt, response=[ maxCapacity:{${max}} ]`);

    return max;
  }

  private calculationAvailableBorrowingCapacity (): number {
    console.log(`[domain] (calculationAvailableBorrowingCapacity) payload=[ loanID:{${this.loanSubmitted.getLoanId()}}`);

    const avaialable = this.calculationMaximumBorrowingCapacity() 
    - this.currentMonthlyDebtCalculation();

    console.log(`[domain] (calculationAvailableBorrowingCapacity) calculated max avaiable, response=[ available:{${avaialable}} ]`);

    return avaialable;
  }

  private isApprovedLoanSubmitted (): boolean {
    const avaialable = this.calculationAvailableBorrowingCapacity();
    const currentDebt = this.loanSubmitted.getMonthlyDebt();

    console.log(`[domain] (isApprovedLoanSubmitted), payload=[ loanId:{${this.loanSubmitted.getLoanId()}}, available:{${avaialable}}, currentDebt:{${currentDebt} } ]`);

    return avaialable > currentDebt;
  }

  public getFinalDecisionOfCreditDebt (): DecisionResultVO {
    let loanId = this.loanSubmitted.getLoanId();
    if (this.isApprovedLoanSubmitted()) {
      return new DecisionResultVO(
        loanId,
        'APPROVED',
        'Customer has debt capacity');
    }

    return new DecisionResultVO(
        loanId,
        'REJECTED',
        'Customer does not have debt capacity');
  }
  
}