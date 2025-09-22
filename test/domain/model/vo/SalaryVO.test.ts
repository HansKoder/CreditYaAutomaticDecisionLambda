import { DecisionLoanException } from "../../../../src/domain/model/exception/DecisionLoanException";
import { SalaryVo } from "../../../../src/domain/model/vo/SalaryVO";

describe("Domain (ValueObject) SalaryVO", () => {

  it("should throw exception because Salary must be positive", () => {
    expect(() => SalaryVo.create(-10))
    .toThrow(DecisionLoanException)
  });
    
  it("should get loanId and current debt successful", () => {
    const vo = SalaryVo.create(100);
    expect(vo.getValue()).toEqual(100)
  });

});