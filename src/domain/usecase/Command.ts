export interface DebtCommand {
    loanId: string,
    debt: number
}

export interface DecisionLoanCommand {
    customerSalary: number,
    currentLoanId: string,
    currentLoanAmount: number,
    debts: DebtCommand[]
}
