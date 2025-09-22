import { DecisionLoanException } from "../exception/DecisionLoanException";

export class SalaryVo {
  private constructor(private readonly value: number) {}

  static create(value: number): SalaryVo {
    if (value <= 0){
      console.log('Salary must be positive');
      throw new DecisionLoanException("Monthly Debt must be positive");
    }

    return new SalaryVo(value);
  }

  getValue(): number {
    return this.value;
  }
}