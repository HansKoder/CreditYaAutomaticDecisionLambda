export class LambdaInfraException extends Error{
    constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, LambdaInfraException.prototype); 
  }
}