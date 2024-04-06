import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ITable, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface DataStackProps extends StackProps {
  // Stack props go here
}

export class DataStack extends Stack {
  database: ITable;
  constructor(scope: Construct, id: string, props?: DataStackProps) {
    super(scope, id, props);

    const dynamoDbTable = new Table(this, 'data-table', {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'database',
    });

    dynamoDbTable.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    this.database = dynamoDbTable;
  }
}
