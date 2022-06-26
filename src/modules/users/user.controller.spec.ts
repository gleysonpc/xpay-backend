import request from 'supertest';

const baseUrl = 'http://localhost:3000/dev';

describe('sign up route', () => {
    const randomNumber = Math.floor(new Date().getTime() / 1000);
    const signUpData = {
        name: 'Gleyson Carvalho',
        email: `gleysonpc${randomNumber}@gmail.com`,
        password: '123456'
    };

    it('should successfully sing up a user', async () => {
        const response = await request(baseUrl)
            .post('/users/signup')
            .send(signUpData);
        expect(response.statusCode).toBe(201);
    });

    it('should not sign up with existent email', async () => {
        const response = await request(baseUrl)
            .post('/users/signup')
            .send(signUpData);
        expect(response.statusCode).toBe(409);
    });
});

describe('login route', () => {
    it('should return 401 when called with invalid credentials', async () => {
        const postData = {
            email: 'teste@teste',
            password: '123'
        };
        const response = await request(baseUrl)
            .post('/users/login')
            .send(postData);
        expect(response.statusCode).toBe(401);
    });

    it('should return accessToken when called with valid credentials', async () => {
        const postData = {
            email: 'gleysonpc@gmail.com',
            password: '123456'
        };
        const response = await request(baseUrl)
            .post('/users/login')
            .send(postData);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
    });
});
