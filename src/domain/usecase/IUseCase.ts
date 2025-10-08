import { DecisionLoanCommand } from "./Command";

export interface IDecisionLoanUseCase {
    execute(command: DecisionLoanCommand): Promise<void>;
}