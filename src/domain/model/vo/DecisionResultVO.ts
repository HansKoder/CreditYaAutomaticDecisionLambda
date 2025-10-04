export class DecisionResultVO {

    constructor(
        private readonly loanId: string, 
        private readonly decision: string, 
        private readonly reason: string,
        private readonly resolutionType: string = 'SELF_DECISION'
    ) {}

}