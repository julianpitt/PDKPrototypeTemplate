export type DynamoDBKeys = {
  PK: string;
  SK: string;
  GSI1PK?: string;
  GSI1SK?: string;
};

export type DDBCommonFields<T extends string> = {
  entity: T;
  createdAt: string;
  updatedAt: string;
};

export type DDBBaseItem<T extends string> = DynamoDBKeys & DDBCommonFields<T>;
