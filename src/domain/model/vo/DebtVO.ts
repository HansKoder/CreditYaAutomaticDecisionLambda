import { DecisionLoanException } from "../exception/DecisionLoanException";

export class DebtVO {
  private constructor(private readonly loanId: string, private readonly monthlyDebt: number) {}

  static create(loanId: string, monthlyDebt: number): DebtVO {
    if (!loanId || !loanId.trim()) {
        console.log('Loan Id is mandatory');
        throw new DecisionLoanException("Loan Id is mandatory");
    }

    if (monthlyDebt <= 0){
      console.log('Monthly Debt must be positive');
      throw new DecisionLoanException("Monthly Debt must be positive");
    }

    return new DebtVO(loanId, monthlyDebt);
  }

  public getLoanId(): string {
    return this.loanId;
  }

  public getMonthlyDebt(): number {
    return this.monthlyDebt;
  }

}