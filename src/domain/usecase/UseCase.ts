import { DecisionLoan } from "../model/DecisionLoan";
import { DecisionResultPublisher } from "../model/gateway/DecisionResultPublisher";
import { DebtVO } from "../model/vo/DebtVO";
import { SalaryVo } from "../model/vo/SalaryVO";
import { DebtCommand, DecisionLoanCommand } from "./Command";
import { IDecisionLoanUseCase } from "./IUseCase";

export class DecisionLoanUseCase implements IDecisionLoanUseCase {

  constructor(
    private readonly publisher: DecisionResultPublisher
  ) {}

  async execute(command: DecisionLoanCommand): Promise<void> {
    const result = this.checkParams(command)
        .getFinalDecisionOfCreditDebt();

    await this.publisher.publish(result);
  }

  private checkParams (cmd: DecisionLoanCommand) : DecisionLoan {
    return DecisionLoan.create({
        'customerSalary': SalaryVo.create(cmd.customerSalary),
        'loanSubmitted': DebtVO.create(cmd.currentLoanId, cmd.currentLoanAmount),
        'debts': this.mapToDebts(cmd.debts)
    });
  }

  private mapToDebts (detbs: DebtCommand[]): DebtVO[] {
    return detbs.map(i => DebtVO.create(i.loanId, i.debt))
  }

}