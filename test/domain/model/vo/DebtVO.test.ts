import { DecisionLoanException } from "../../../../src/domain/model/exception/DecisionLoanException";
import { DebtVO } from "../../../../src/domain/model/vo/DebtVO";

describe("Domain (ValueObject) DebtVO", () => {

  it("should throw exception because Loan Id must be mandatory", () => {
    expect(() => DebtVO.create(' ', 0))
    .toThrow(DecisionLoanException)
  });

  it("should throw exception because Debt must be positive", () => {
    expect(() => DebtVO.create('101', -10))
    .toThrow(DecisionLoanException)
  });
    
  it("should get loanId and current debt successful", () => {
    const vo = DebtVO.create('101', 100);

    expect(vo.getLoanId()).toEqual('101')
    expect(vo.getMonthlyDebt()).toEqual(100)
  });
  

});