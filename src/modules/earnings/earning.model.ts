import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { InternalError } from '../../common/httpErrors';

const {
    LOCAL,
    LOCAL_EARNINGS_TABLE_NAME,
    EARNINGS_TABLE_NAME,
    DYNAMO_LOCAL_REGION,
    DYNAMO_LOCAL_ENDPOINT,
} = process.env;

const TableName = (LOCAL ? LOCAL_EARNINGS_TABLE_NAME : EARNINGS_TABLE_NAME) as string;

export interface IEarning {
    id: string;
    description: string;
    balanceId: string;
    amount: number;
}

interface EarningQueryResult extends DynamoDB.DocumentClient.QueryOutput {
    Items?: IEarning[]
}

export class Earning {
    private dynamodb = new DynamoDB.DocumentClient({
        region: DYNAMO_LOCAL_REGION,
        endpoint: DYNAMO_LOCAL_ENDPOINT,
    });

    async createEarning(description: string, balanceId: string, amount: number) {
        try {
            const item: IEarning = {
                id: uuid(),
                description,
                balanceId,
                amount,
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

    async getEarningsByBalanceId(balanceId: string) {
        const params: DynamoDB.DocumentClient.QueryInput = {
            TableName,
            IndexName: 'byBalanceId',
            KeyConditionExpression: 'balanceId = :balanceId',
            ExpressionAttributeValues: { ':balanceId': balanceId },
        };
        try {
            const { Items } = await this.dynamodb.query(params).promise();
            return Items as EarningQueryResult;
        } catch (error) {
            throw new InternalError(error as string);
        }
    }
}

