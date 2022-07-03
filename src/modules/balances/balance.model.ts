import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { InternalError } from '../../common/httpErrors';

const {
    LOCAL,
    LOCAL_BALANCES_TABLE_NAME,
    BALANCES_TABLE_NAME,
    DYNAMO_LOCAL_REGION,
    DYNAMO_LOCAL_ENDPOINT,
} = process.env;

const TableName = (LOCAL ? LOCAL_BALANCES_TABLE_NAME : BALANCES_TABLE_NAME) as string;

export interface IBalance {
  id?: string;
  description: string;
  userId: string;
}

interface BalanceQueryResult extends DynamoDB.DocumentClient.QueryOutput {
    Items?: IBalance[]
}

export class Balance {
    private dynamodb = new DynamoDB.DocumentClient({
        region: DYNAMO_LOCAL_REGION,
        endpoint: DYNAMO_LOCAL_ENDPOINT,
    });

    async createBalance(description: string, userId: string) {
        try {
            const item: IBalance = {
                id: uuid(),
                description,
                userId
            };
            await this.dynamodb.put({
                TableName,
                Item: item,
            }).promise();
            return item;
        } catch (error) {
            console.error(error);
            throw new InternalError(error as string);
        }
    }

    async getBalancesByUserId(userId: string) {
        const params: DynamoDB.DocumentClient.QueryInput = {
            TableName,
            IndexName: 'byUserId',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {':userId': userId },
        };
        try {
            const { Items } = await this.dynamodb.query(params).promise();
            return Items as BalanceQueryResult;
        } catch (error) {
            throw new InternalError(error as string);
        }
    }
}


