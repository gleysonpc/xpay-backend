import request from 'supertest';
const baseUrl = 'http://localhost:3000/dev';

let token: string;

async function authenticate() {
    const signUpData = {
        email: 'gleysonpc@gmail.com',
        password: '123456'
    };
    const loggedUser = await request(baseUrl)
        .post('/users/login')
        .send(signUpData);
    if (loggedUser.status === 200) {
        const { accessToken } = loggedUser.body;
        return `Bearer ${accessToken}`;
    }
    return '';
}

beforeAll(() => {
    return new Promise<void>((done) => {
        authenticate()
            .then((_token) => {
                token = _token;
                done();
            });
    });
});

describe('create balance route', () => {
    it('should throw if not provided description for new balance', async () => {
        const response = await request(baseUrl)
            .post('/balances')
            .set({Accept: 'application/json'})
            .set({Authorization: token})
            .send();
        expect(response.statusCode).toBe(400);
    });

    it('should create a balance if provided description for new balance', async () => {
        const newBalanceData = {
            description: 'new Balance Description'
        };
        const response = await request(baseUrl)
            .post('/balances')
            .set({Accept: 'application/json'})
            .set({Authorization: token})
            .send(newBalanceData);
        expect(response.statusCode).toBe(201);
    });

    it('should return unauthorized if not provided a valid accessToken', async () => {
        const newBalanceData = {
            description: 'new Balance Description'
        };
        const response = await request(baseUrl)
            .post('/balances')
            .set({Accept: 'application/json'})
            .set({Authorization: ''})
            .send(newBalanceData);
        expect(response.statusCode).toBe(401);
    });
});
