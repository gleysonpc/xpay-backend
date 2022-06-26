import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import bcript from 'bcryptjs';
import { InternalError } from '../../common/httpErrors';

const {
    LOCAL,
    LOCAL_USERS_TABLE_NAME,
    USERS_TABLE_NAME,
    DYNAMO_LOCAL_REGION,
    DYNAMO_LOCAL_ENDPOINT,
} = process.env;

const TableName = (LOCAL ? LOCAL_USERS_TABLE_NAME : USERS_TABLE_NAME) as string;
const ProjectionExpression = 'id, #name, email';
const ExpressionAttributeNames = {'#name': 'name'};

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
}

export class User {
    private dynamodb = new DynamoDB.DocumentClient({
        region: DYNAMO_LOCAL_REGION,
        endpoint: DYNAMO_LOCAL_ENDPOINT,
    });

    private hashPassword(password: string): string {
        const salt = bcript.genSaltSync(10);
        return bcript.hashSync(password, salt);
    }

    async getUsers() {
        const params = {
            TableName,
            ProjectionExpression,
            ExpressionAttributeNames ,
        };
        try {
            const items = await this.dynamodb.scan(params).promise();
            return items.Items;
        } catch (error) {
            console.error(error);
            throw new InternalError(error as string);
        }
    }

    async getUserById(userId: string) {
        const params: DynamoDB.DocumentClient.GetItemInput = {
            TableName,
            Key: { id: userId},
            ProjectionExpression,
            ExpressionAttributeNames
        };
        try {
            const { Item } = await this.dynamodb.get(params).promise();
            return Item;
        } catch(error) {
            console.error(error);
            throw new InternalError(error as string);
        }
    }

    async getUserByEmail(email: string) {
        const params: DynamoDB.DocumentClient.QueryInput = {
            TableName: TableName,
            IndexName: 'userByEmail',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: { ':email': email },
        };
        const { Items } = await this.dynamodb.query(params).promise();
        if (Items?.length) {
            const user = Items[0] as IUser;
            return user;
        }
        return null;
    }

    async createUser(name: string) {
        try {
            const item = { id: uuid(), name };
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

    async signUp(name: string, email: string, password: string): Promise<IUser> {
        try {
            const newUser = {
                id: uuid(),
                name,
                email,
                password: this.hashPassword(password),
            };
            await this.dynamodb.put({TableName, Item: newUser}).promise();
            return newUser;
        } catch (error) {
            console.error(error);
            throw new InternalError(error as string);
        }
    }

    async validateAndUserPassword(email: string, password: string) {
        const user = await this.getUserByEmail(email);
        if (user && bcript.compareSync(password, String(user.password))) {
            return user.email;
        }
        return null;
    }
}


