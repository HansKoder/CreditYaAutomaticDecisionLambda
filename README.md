
## SQS notifications

```bash
aws sqs create-queue \
  --queue-name notifications-queue \
  --endpoint-url http://localhost:4566 \
  --region us-east-2

```

## SQS decision-request

```bash
aws sqs create-queue \
  --queue-name decisions-request-queue \
  --endpoint-url http://localhost:4566 \
  --region us-east-2

```


## SQS decision-response

```bash
aws sqs create-queue \
  --queue-name decisions-response-queue \
  --endpoint-url http://localhost:4566 \
  --region us-east-2

```


## SQS list all queues

```cmd
aws sqs list-queues \
  --endpoint-url http://localhost:4566 \
  --region us-east-2
```

## SQS example send manual decision-request (Approved)

```cmd
aws sqs send-message \
  --queue-url http://localhost:4566/000000000000/decisions-request-queue \
  --message-body '{
    "customerSalary": 1500,
    "currentLoanId": "001",
    "currentLoanAmount": 200,
    "debts": [{"loanId": "100", "debt": 50}]
  }' \
  --endpoint-url http://localhost:4566 \
  --region us-east-2

```


## SQS example send manual decision-request (Rejected)

```cmd
aws sqs send-message \
  --queue-url http://localhost:4566/000000000000/decisions-request-queue \
  --message-body '{
    "customerSalary": 1500,
    "currentLoanId": "001",
    "currentLoanAmount": 500,
    "debts": [{"loanId": "100", "debt": 500}]
  }' \
  --endpoint-url http://localhost:4566 \
  --region us-east-2

```

## SQS Verify decisions-response - response.

```cmd
aws sqs receive-message \
  --queue-url http://localhost:4566/000000000000/decisions-response-queue \
  --endpoint-url http://localhost:4566 \
  --region us-east-2
```


## SQS Verify decisions-request - response.

```cmd
aws sqs receive-message \
  --queue-url http://sqs.us-east-2.localhost.localstack.cloud:4566/000000000000/decisions-request-queue \
  --endpoint-url http://localhost:4566 \
  --region us-east-2
```

## SQS remove queues notifications

```cmd
aws sqs purge-queue \
  --queue-url http://sqs.us-east-2.localhost.localstack.cloud:4566/000000000000/notifications-queue \
  --endpoint-url http://localhost:4566 \
  --region us-east-2
```

## SQS remove queues decisions

```cmd
aws sqs purge-queue \
  --queue-url http://sqs.us-east-2.localhost.localstack.cloud:4566/000000000000/decisions-request-queue \
  --endpoint-url http://localhost:4566 \
  --region us-east-2
```

## Running serverless

```cmd
sls offline start --stage local
```
