export class DecisionLoanException extends Error{
    constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DecisionLoanException.prototype); 
  }
}