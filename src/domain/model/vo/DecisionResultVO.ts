export class DecisionResultVO {

    constructor(
        private readonly loanId: string, 
        private readonly decision: string, 
        private readonly reason: string,
        private readonly resolutionType: string = 'SELF_DECISION'
    ) {}

    getLoanId(): string {
        return this.loanId;
    }

    getDecision(): string {
        return this.decision;
    }

    getReason(): string {
        return this.reason;
    }

    getResolutionType(): string {
        return this.resolutionType;
    }
}
