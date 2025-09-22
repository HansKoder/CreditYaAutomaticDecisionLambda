import { DebtVO } from "./vo/DebtVO";
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
  currentMonthlyDebtCalculation (): number {
    return this.currentDebts
    .map(i => i.getMonthlyDebt())
    .reduce((a: number, b: number) => {
      return a + b;
    },this.INIT_VALUE)
  }

  calculationMaximumBorrowingCapacity (): number {
    return this.salary.getValue() * this.POLICY_RISK;
  }

  calculationAvailableBorrowingCapacity (): number {
    return this.calculationMaximumBorrowingCapacity() 
    - this.currentMonthlyDebtCalculation();
  }

  isApprovedLoanSubmitted (): boolean {
    return this.calculationAvailableBorrowingCapacity() > this.loanSubmitted.getMonthlyDebt();
  }
  
}