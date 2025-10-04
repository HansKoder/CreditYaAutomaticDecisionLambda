import { DecisionResultVO } from "../vo/DecisionResultVO";

export interface DecisionResultPublisher {
    publish(decisionResult: DecisionResultVO): Promise<void>
}