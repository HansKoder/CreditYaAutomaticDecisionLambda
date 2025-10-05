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
    return this.currentDebts
    .map(i => i.getMonthlyDebt())
    .reduce((a: number, b: number) => {
      return a + b;
    },this.INIT_VALUE)
  }

  private calculationMaximumBorrowingCapacity (): number {
    return this.salary.getValue() * this.POLICY_RISK;
  }

  private calculationAvailableBorrowingCapacity (): number {
    return this.calculationMaximumBorrowingCapacity() 
    - this.currentMonthlyDebtCalculation();
  }

  private isApprovedLoanSubmitted (): boolean {
    return this.calculationAvailableBorrowingCapacity() > this.loanSubmitted.getMonthlyDebt();
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